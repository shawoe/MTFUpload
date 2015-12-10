<!DOCTYPE html>
<html>
<head lang="en">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
    <title>HTML5多文件上传</title>
    <link rel="stylesheet" href="/template/1/stylesheet/x.base.css">
    <link rel="stylesheet" href="/template/1/stylesheet/x.multifile.css">
</head>
<body>
<div class="multifile"></div>
<script src="/template/1/script/x.core.js"></script>
<script src="/template/1/script/x.multifile.js"></script>
<script>
    X.multiFile({
        selector: '.multifile'
    });
</script>

<#--<form action="upload.html" enctype="multipart/form-data" method="post">-->
<#--<input multiple="multiple" name="file" type="file">-->
<#--<input type="submit" value="上传">-->
<#--</form>-->
<#--<img src="${(a)!''}">-->
</body>
</html>