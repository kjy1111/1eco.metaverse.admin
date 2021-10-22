package oneEco.web;

import grinbi.message.MessageSourceWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.ServletRequest;

@Controller
@RequestMapping(value = "/common")
public class CommonController {
    @Autowired
    private MessageSourceWrapper messageSourceWrapper;

    @RequestMapping(value = "/editor.do", method = RequestMethod.GET)
    public String editor(ServletRequest request) throws Exception {
        request.setAttribute("MaxLength", this.messageSourceWrapper.getMessage("file.maxLength"));
        request.setAttribute("Category", "Editor");
        request.setAttribute("textareaName", request.getParameter("textareaName"));
        request.setAttribute("UploadPath", this.messageSourceWrapper.getMessage("file.uploadPath"));
        return "include/editor";
    }

}
