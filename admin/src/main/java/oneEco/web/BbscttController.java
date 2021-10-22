package oneEco.web;

import com.google.common.base.Strings;
import grinbi.common.model.GridJsonObject;
import grinbi.common.model.JsonObject;
import grinbi.message.MessageSourceWrapper;
import grinbi.validation.utility.ValidatorUtil;
import oneEco.model.logical.BbscttSearchModel;
import oneEco.model.physical.BbscttModel;
import oneEco.service.BbscttService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/admin/bbsctt")
public class BbscttController {

    @Autowired
    private BbscttService bbscttService;
    @Autowired
    private MessageSourceWrapper messageSourceWrapper;

    @ResponseBody
    @RequestMapping(value = "/getBbscttList.do", method = RequestMethod.POST)
    public GridJsonObject getBbsList(BbscttSearchModel model, Errors errors, HttpServletRequest request) throws Exception {
        GridJsonObject jo = new GridJsonObject(new JsonObject());
        int offset = (model.getPageSize() * (model.getPageNumber() - 1));
        int limit = model.getPageSize();

        model.setOffset(offset);
        model.setLimit(limit);

        jo.setTotalrecords(this.bbscttService.getBbscttListCount(model));
        List<BbscttModel> list  = this.bbscttService.getBbscttList(model);
        list.forEach(m -> m.setRowNum(jo.getTotalrecords() - m.getRowNum() + 1));
        jo.setRows(list);
        jo.IsSucceed = true;
        jo.setPagenum(model.getPageNumber());
        jo.setPagesize(model.getPageSize());
        return jo;
    }

    @ResponseBody
    @RequestMapping(value = "/getBbsctt.do", method = RequestMethod.POST)
    public JsonObject getBbs(BbscttModel model, Errors errors, HttpServletRequest request) throws Exception {
        JsonObject jo = new JsonObject();
//        if (Strings.isNullOrEmpty(request.getHeader("referer")) || request.getHeader("referer").indexOf("admin") < 0) {
//            this.bbscttService.addRdcnt(model);
//        }
        jo.Data = this.bbscttService.getBbsctt(model);
        if (jo.Data == null) {
            jo.IsSucceed = false;
            jo.Message = this.messageSourceWrapper.getMessage("bbsctt.notFound");
        } else {
            jo.IsSucceed = true;
        }
        return jo;
    }

    @ResponseBody
    @RequestMapping(value = "/add.do", method = RequestMethod.POST)
    public JsonObject add(@Valid BbscttModel model, Errors errors, HttpServletRequest request) throws Exception {
        JsonObject jo = new JsonObject();
        this.bbscttService.add(model);
        jo.IsSucceed = true;
        return jo;
    }
}
