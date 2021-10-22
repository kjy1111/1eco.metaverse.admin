package oneEco.web;

import grinbi.common.model.JsonObject;
import grinbi.configurations.SessionListener;
import grinbi.message.MessageSourceWrapper;
import grinbi.utility.SessionCookieUtil;
import oneEco.model.logical.OprtrLoginModel;
import oneEco.model.physical.BbscttModel;
import oneEco.model.physical.OprtrModel;
import oneEco.service.OprtrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

@Controller
@RequestMapping(value = "/admin/account")
public class AccountController {

    @Autowired
    private OprtrService oprtrService;
    @Autowired
    private MessageSourceWrapper messageSourceWrapper;

    @ResponseBody
    @RequestMapping(value = "/login.do", method = RequestMethod.POST)
    public JsonObject login(@Valid OprtrLoginModel loginModel, Errors errors, HttpServletRequest request, HttpSession session) throws Exception {

        JsonObject jo = new JsonObject();

        SessionCookieUtil.removeSessionAttribute(request, this.messageSourceWrapper.getMessage("session.name"));
        SessionCookieUtil.removeSessionAttribute(request, "roleList");

        OprtrModel oprtrModel = this.oprtrService.login(loginModel);

        if (oprtrModel != null) {
            SessionListener.login(loginModel.getUserid());
            oprtrModel.setUserid(loginModel.getUserid());
            session.setAttribute(this.messageSourceWrapper.getMessage("session.name"), oprtrModel);
            jo.IsSucceed = true;
            jo.RedirectUrl = "/?pageid=N-01";

            // 로그인 후에 반드시 한번 호출해 주어야 한다.
            this.oprtrService.getRoles();
        } else {
            jo.IsSucceed = false;
            jo.Message = "로그인에 실패 하였습니다.";
        }
        return jo;
    }
}
