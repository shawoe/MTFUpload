/**
 * @fileOverview HTML5 Multi Files Upload Widgets
 * @depends
 * @author xiechengxiong
 * @date 2014-03-04
 * @version 1.0
 * @interface
 * @update
 */
(function(win, doc) {
  var MultiFile = function(obj, opts) {
    this.obj = obj;
    this.opts = opts;
    this.container = this.createContainer();
    this.placeholder = X.query('.placeholder', this.container)[0];
    this.listWrap = X.query('.filelist', this.container)[0];
    this.status = X.query('.status', this.container)[0];
    this.file = X.query('input', this.container);
    this.progress = X.query('.status .progress', this.container)[0];
    this.info = X.query('.status .info', this.container)[0];
    this.files = [];
    this.index = 0;
    this.bindEvent();
  };
  MultiFile.prototype = {
    bindEvent: function() {
      var _this = this;
      this.file.each(function() {
        var file = this;
        X.on(this, 'change', function() {
          _this.selectFile(file.files);
        });
      });
      X.on(this.container, 'click', function(e) {
        var target = e.target || win.event.srcElement;
        var role = X.attr(target, 'data-role');
        var index = X.index(target.parentNode.parentNode || doc.body);
        switch (role) {
          case 'upload': _this.uploadFile(); break;
          case 'delete': _this.deleteFile(index); break;
          case 'rotateLeft': _this.rotate(index, -1); break;
          case 'rotateRight': _this.rotate(index, 1); break;
          default :break;
        }
      });
      X.on(doc, 'dragleave', function(e) {e.preventDefault();});
      X.on(doc, 'drop', function(e) {e.preventDefault();});
      X.on(doc, 'dragenter', function(e) {e.preventDefault();});
      X.on(doc, 'dragover', function(e) {e.preventDefault();});
      X.on(this.container, 'drop', function(e) {
        e.preventDefault();
        _this.selectFile(e.dataTransfer.files);
      });
    },
    changeArray: function(list) {
      var arr = [];
      for(var i = 0, len = list.length; i < len; i++) {
        arr.push(list[i]);
      }
      return arr;
    },
    changeInfo: function() {
      var fileSize = 0;
      for(var i = 0; i < this.files.length; i++) {
        fileSize += this.files[i].size;
      }
      if (fileSize > 1024 * 1024) {
        fileSize = (Math.round(fileSize * 100 / (1024 * 1024)) / 100).toString() + 'MB';
      } else {
        fileSize = (Math.round(fileSize * 100 / 1024) / 100).toString() + 'KB';
      }
      this.info.innerHTML = '选中'+this.files.length+'图片，共'+fileSize+'。';
    },
    changePanel: function(f1, f2) {
      this.placeholder.style.display = f1;
      this.listWrap.style.display = f2;
      this.status.style.display = f2;
    },
    checkType: function(type) {
      var types = this.opts.fileType.split(';');
      var obj = {};
      for(var i = 0, len = types.length; i < len; i++) {
        var key = types[i].split('.')[1];
        if(typeof key !== 'undefined') {
          obj[key] = true;
        }
      }
      return obj[type.split('/')[1]];
    },
    createContainer: function() {
      var placeholder = '<div class="placeholder"><div class="wrap"><div class="add"><label>点击选择图片</label><input type="file" multiple="multiple" /></div><p class="tips">支持图片拖拽, 最多可上传'+this.opts.maxCount+'张图片</p></div></div>';
      var fileList = '<ul class="filelist"></ul>';
      var status = '<div class="status"><div class="progress"><span class="text">0%</span><span class="percentage"></span></div><div class="info"></div><div class="btns"><div class="add"><label>继续添加</label><input type="file" multiple="multiple" /></div><div class="upload" data-role="upload">开始上传</div></div></div>';
      var container = doc.createElement('div');
      container.className = 'x-multifile-wrap';
      container.innerHTML = placeholder+fileList+status;
      container.style.cssText = 'width:'+this.opts.width+'px;height:'+this.opts.height+'px;';
      this.obj.appendChild(container);
      return container;
    },
    createFile: function(name, url) {
      var img = '<p class="img" style="height:'+this.opts.picHeight+'px"><img src="'+url+'"/></p>';
      var title = '<p class="title">'+name+'</p>';
      var progress = '<p class="progress"><span></span></p>';
      var tool = '<div class="tool"><a data-role="delete">&#xf013f;</a><a data-role="rotateRight">&#xf013b;</a><a data-role="rotateLeft">&#xf013a;</a></div>';
      var result = '<span class="result"></span>';
      var li = doc.createElement('li');
      li.innerHTML = img+title+progress+tool+result;
      li.style.cssText = 'width:'+this.opts.picWidth+'px;height'+this.opts.picHeight+'px;';
      this.listWrap.appendChild(li);
      this.fillList = X.query('.filelist li', this.container);
    },
    deleteFile: function(index) {
      this.fillList[index].remove();
      this.files.splice(index, 1);
      if(this.files.length === 0) {
        this.changePanel('block', 'none');
      }
      this.changeInfo();
    },
    rotate: function(index, direction) {
      var img = X.query('.img', this.fillList[index])[0];
      var angle = X.data(img, 'angle') || 0;
      angle += direction*90;
      img.style.transform = 'rotate('+angle+'deg)';
      img.style.webkitTransform = 'rotate('+angle+'deg)';
      X.data(img, 'angle', angle);
    },
    selectFile: function(fs) {
      fs = this.changeArray(fs);
      var cLen = fs.length;
      var tLen = this.files.length;
      var max = this.opts.maxCount;
      if(tLen+cLen > max) {
        fs.splice(max-tLen-cLen, tLen+cLen-max);
      }
      for(var i = 0; i < fs.length; i++) {
        var file = fs[i];
        if(this.checkType(file.type)) {
          if(file.size > 100000) {
            file.packet = [];
            file.breakpoint = 0;
            file.tag = Math.floor(Math.random() * 10E10) + '_' + new Date().getTime();
            for(var j = 0, len = file.size/100000; j < len; j++) {
              var blob = file.slice(j*100000, (j+1)*100000);
              blob.type = file.type;
              blob.name = file.name;
              file.packet.push(blob);
            }
          }
          this.files.push(file);
          (function(file, _this) {
            var reader = new FileReader();
            reader.onload = function( evt ){
              _this.createFile(file.name, evt.target.result);
            };
            reader.readAsDataURL(file);
          })(file, this);
        }
      }
      if(this.files.length > 0) {
        this.changePanel('none', 'block');
        this.changeInfo();
      }
    },
    uploadComplete: function(e) {
      var file = this.files[this.index];
      if(file.packet && file.breakpoint < file.packet.length - 1) {
        file.breakpoint++;
        this.uploadFile();
      } else {
        var result = X.query('.result', this.fillList[this.index])[0];
        result.style.display = 'inline-block';
        result.innerHTML = '&#xf00b2;';
        if(this.index === this.files.length - 1) {
          this.opts.allCompleteCallback && this.opts.allCompleteCallback(e);
          this.progress.style.display = 'none';
          this.info.innerHTML = '共'+this.files.length+'张图片，已上传'+(this.index+1)+'张';
        } else {
          this.index++;
          this.uploadFile();
          this.info.innerHTML = '正在上传'+(this.index+1)+'/'+this.files.length+'张图片';
        }
        var percentComplete =  Math.floor((this.index/this.files.length)*100)+'%';
        this.progress.innerHTML = '<span class="text">'+percentComplete+'</span><span class="percentage" style="width:'+percentComplete+'"></span>';
        this.opts.uploadCompleteCallback && this.opts.uploadCompleteCallback(e);
      }
    },
    uploadFailed: function(e) {
      this.opts.uploadErrorCallback && this.opts.uploadErrorCallback(e);
    },
    uploadFile: function() {
      var xhr = new XMLHttpRequest();
      var _this = this;
      xhr.upload.addEventListener('progress', function(e) {_this.uploadProgress(e);}, false);
      xhr.addEventListener('load', function(e) {_this.uploadComplete(e);}, false);
      xhr.addEventListener('error', function(e) {_this.uploadFailed(e);}, false);
      xhr.open('post', this.opts.uploadUrl, true);
      var fd = new FormData();
      var file = this.files[this.index];
      var fieldName = this.opts.fieldName;
      if(file.packet) {
        fd.append('breakpoint', file.breakpoint);
        fd.append('len', file.packet.length);
        fd.append('fileName', file.name);
        fd.append('tag', file.tag);
        fd.append(fieldName, file.packet[file.breakpoint]);
      } else {
        fd.append(fieldName, file);
      }
      for(var name in this.opts.extraData) {
        fd.append(name, this.opts.extraData[name]);
      }
      xhr.send(fd);
      this.progress.style.display = 'inline-block';
    },
    uploadProgress: function(e) {
      if(e.lengthComputable) {
        var progressList = X.query('.filelist .progress span', this.container);
        var percentage = Math.round(e.loaded * 100 / e.total);
        var file = this.files[this.index];
        if(file.packet) {
          percentage = Math.round((file.breakpoint * e.total + e.loaded) * 100 / (file.packet.length*e.total));
        }
        progressList[this.index].style.width = percentage +'%';
      }
    }
  };
  var list = [];
  X.multiFile = function (options) {
    options = X.extend(X.multiFile.defualts, options);
    var element = X.query(options['selector']);
    element = X.isArray(element) ? element : [element];
    for (var i = 0, len = element.length; i < len; i++) {
      list.push(new MultiFile(element[i], options));
    }
  };
  X.multiFile.defualts = {
    selector: '.multifile',//容器选择器
    width: 800,//容器宽度
    height: 400,//容器高度
    picWidth: 130,//预览图宽度
    picHeight: 130,//预览图高度
    maxCount: 30,//最大上传限制
    uploadUrl: '/upload.html',//上传地址
    fieldName: 'file',//提交时的表单名称
    fileType: '*.gif;*.png;*.jpg;*.jpeg;*.bmp;',
    extraData: {album: 'album'},//上传时额外的数据
    selectFileCallback: null,// 选择文件的回调
    deleteFileCallback: null,// 删除某个文件的回调
    exceedFileCallback: null,// 文件超出限制的最大体积时的回调
    startUploadCallback: null,// 开始上传某个文件时的回调
    uploadCompleteCallback: null,// 某个文件上传完成的回调
    uploadErrorCallback: null,// 某个文件上传失败的回调
    allCompleteCallback: null// 全部上传完成时的回调
  };
})(window, document);
