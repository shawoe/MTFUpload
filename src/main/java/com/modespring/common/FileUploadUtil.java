package com.modespring.common;

import org.apache.commons.io.FileUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by Shawoe on 2015/12/9.
 */
public class FileUploadUtil {
    public static String uploadFile(MultipartFile file, String realPath) throws Exception {
        String fileName = file.getOriginalFilename();
        if (file.isEmpty()) {
            throw new Exception("文件未上传，请选择你要上传的文件");
        } else if (realPath.isEmpty()) {
            throw new Exception("文件上传路径不存在");
//        } else if (fileName.indexOf('.') == -1) {
//            throw new Exception("文件未上传，请选择你要上传的文件");
        } else {
            String fileExt = fileName.substring(fileName.lastIndexOf('.'));
            DateFormat format = new SimpleDateFormat("yyyyMMddhhmmss");
            fileName = file.getSize() + "-" + format.format(new Date()) + fileExt;
            FileUtils.copyInputStreamToFile(file.getInputStream(), new File(realPath, fileName));
            return fileName;
        }
    }
}
