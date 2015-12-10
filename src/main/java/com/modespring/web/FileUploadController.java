package com.modespring.web;

import com.modespring.common.FileUploadUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

/**
 * Created by Shawoe on 2015/12/9.
 */
@Controller
public class FileUploadController {
    @RequestMapping(value = "index", method = RequestMethod.GET)
    public ModelAndView index(ModelAndView modelAndView) {
        modelAndView.setViewName("1/index");
        return modelAndView;
    }
    @RequestMapping(value = "upload", method = RequestMethod.POST)
    @ResponseBody
    public void upload(HttpSession session, @RequestParam MultipartFile file) {
        try {
            if (file != null) {
                String directory = file.hashCode() + "";
                String realPath = session.getServletContext().getRealPath("/files/" + directory);
                String fileName = FileUploadUtil.uploadFile(file, realPath);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
