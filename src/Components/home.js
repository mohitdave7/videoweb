import React from "react";
import styled from "styled-components";
import "antd/dist/antd.css";
import "./styles.css";
import { Form, Upload, Button, message, Input, InputNumber, Label } from "antd";
import { UploadOutlined } from "@ant-design/icons";
// import  ffmpeg from "fluent-ffmpeg";
// import path from "@ffmpeg-installer/ffmpeg"
// var pathToFfmpeg = require('ffmpeg-static');
// let videoStitch = require('video-stitch');
// import  {cut,concat,merge} from "video-stitch";
// const ffmpeg = require("fluent-ffmpeg")
// ffmpeg.setFfmpegPath(path)



//video cuts and merging is not implemented because of fluent-ffmpeg issues in th system 

const FormItem = Form.Item;
const PhotoText = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding: 2rem 0 1rem 0;
  display: block;
  text-align: -webkit-auto;
`;

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileName: "",
      frontDesign: "",
      clippedArray: [],
      enableClips:false
    };
  }
  handleSave = (info) => {
    this.setState({ fileName: info.file.originFileObj }, () => {
      console.log(this.state.fileName);
    });
    if (info.file.status !== "uploading") {
      let reader = new FileReader();
      reader.onload = (e) => {
        console.log(e.target.result);
      };
      reader.readAsText(info.file.originFileObj);
    }
    if (info.file.status === "done") {
      var reader = new FileReader();
      reader.onload = (e) => {
        //Image URL e.target.result
        this.setState({
          frontDesign: [e.target.result],
        });
      };
      reader.readAsDataURL(info.file);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      //   this.setState({
      //     frontDesign: '',
      //   });
    }
  };
  beforeUpload = (file) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      //Image URL e.target.result
      this.setState({
        frontDesign: [e.target.result],
      });
    };
    debugger;
    reader.readAsDataURL(file);
  };
  handleChange = (value, name) => {
    this.setState({ [name]: value });
  };
  trimVideo = () => {
    const { startTime, endTime, clippedArray } = this.state;
    let obj = {
      startTime: startTime ? startTime : 0.1,
      endTime: endTime ? endTime : 0.1,
      //   duration: endTime - startTime,
    };
    clippedArray.push(obj);

    this.setState({ clippedArray });
  };
  makeClip = () => {

    const { clippedArray,frontDesign } = this.state;
    console.log("start time clippedArray", clippedArray);
    this.setState({enableClips:true})
    
    // videoCut({
    //   silent: true, // optional. if set to false, gives detailed output on console
    // })
    //   .original({
    //     fileName: this.state.frontDesign,
    //     duration: "01:04",
    //   })
    //   .exclude(clippedArray)
    //   .cut()
    //   .then((videoClips) => {
    //     debugger;
    //     // [{startTime, duration, fileName}]
    //   });
  };

  render() {
    const props = {
      onChange: (info) => {
        this.handleSave(info);
      },
      beforeUpload: (file, detail) => {
        this.beforeUpload(file);
      },

      multiple: false,
      action: "action url",
      listType: "picture",
      //   showUploadList: false,
    };

    return (
      <div>
        <PhotoText>Select a Video to Upload</PhotoText>
        <FormItem>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          {/* <input ref="file" type="file" name="front Design" onChange={this.frontDesign}/> */}
        </FormItem>
        {this.state.frontDesign ? (
          <div className="wrapper">
            <FormItem className="item1">
              <video width="400" height="300" controls>
                <source
                  src={this.state.frontDesign}
                  type="video/mp4"
                  accept="video/mp4"
                />
              </video>
            </FormItem>
            <FormItem style={{ margin: "70px" }}>
              <PhotoText>
                Enter the start time and End Time of the video to be Clip:
              </PhotoText>
              <Form name="basic" initialValues={{ remember: true }}>
                <Form.Item
                  label="Start Time"
                  name="startTime"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Start Time!",
                    },
                  ]}
                >
                  <InputNumber
                    name="startTime"
                    style={{ width: 200 }}
                    defaultValue="0.1"
                    min="0"
                    step="0.1"
                    onChange={(e) => this.handleChange(e, "startTime")}
                  />
                </Form.Item>
                <Form.Item
                  label="End Time"
                  name="EndTime"
                  rules={[
                    { required: true, message: "Please input your End Time!" },
                  ]}
                >
                  <InputNumber
                    name="EndTime"
                    defaultValue="0.1"
                    style={{ width: 200 }}
                    min="0"
                    step="0.1"
                    onChange={(e) => this.handleChange(e, "endTime")}
                  />
                </Form.Item>
              </Form>
              <Button onClick={this.trimVideo} style={{ marginRight: "30px" }}>
                Trim
              </Button>
              <Button
                onClick={this.makeClip}
                disabled={this.state.clippedArray.length > 0 ? false : true}
              >
                Merge clips
              </Button>
            </FormItem>
          </div>
        ) : null}
        {this.state.clippedArray.length > 0 &&
          this.state.clippedArray.map((item, i) => (
            <div className="clip" key={i}>
              <pre >
                Clip({i + 1}): {item.startTime} to {item.endTime}
              </pre>
              {/* <a>remove</a> */}
            </div>
          ))}
            {this.state.enableClips?
            <FormItem className="item1">
              <video width="400" height="300" controls>
                <source
                  src={this.state.frontDesign}
                  type="video/mp4"
                  accept="video/mp4"
                />
              </video>
            </FormItem>
            :
            null}
      </div>
    );
  }
}
export default Home;
