package oneEco.web;

import com.google.common.base.Strings;
import grinbi.message.MessageSourceWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.LocaleResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Locale;

@Controller
public class IndexController {

    @Autowired
    private MessageSourceWrapper messageSourceWrapper;

    @Autowired
    private LocaleResolver localeResolver;

    @RequestMapping(method = RequestMethod.GET)
    public String index(HttpServletRequest request, HttpServletResponse response) {
        return "/index";
    }

    @RequestMapping(value = "/page.do", method = RequestMethod.GET)
    public String page(HttpServletRequest request, HttpServletResponse response) {
        if (!Strings.isNullOrEmpty(request.getQueryString()) && !Strings.isNullOrEmpty(request.getParameter("pageid"))){
            return ".admin_" + request.getParameter("pageid").charAt(0) + "/" +request.getParameter("pageid");
        }else {
            return "/index";
        }
    }

    @RequestMapping(value = "/index.do", method = RequestMethod.GET)
    public String index2(HttpServletRequest request, HttpServletResponse response) {
        Locale locale = new Locale("en");
        this.localeResolver.setLocale(request, response, locale);
        return "/index";
    }
}
