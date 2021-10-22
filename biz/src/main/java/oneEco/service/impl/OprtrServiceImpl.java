package oneEco.service.impl;

import grinbi.membership.AbstractUserModel;
import grinbi.message.MessageSourceWrapper;
import grinbi.utility.bean.DynamicBeanProvider;
import oneEco.data.OprtrData;
import oneEco.model.logical.OprtrLoginModel;
import oneEco.model.physical.RoleModel;
import oneEco.model.physical.OprtrModel;
import oneEco.service.OprtrService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.List;

@Primary
@Service
public class OprtrServiceImpl implements OprtrService {

    @Autowired
    private OprtrData oprtrData;


    @Override
    public OprtrModel login(OprtrLoginModel model) throws Exception {
        return this.oprtrData.login(model);
    }

    /*
     * (non-Javadoc)
     * @see grinbi.account.service.AccountService#getUser()
     */
    @Override
    public OprtrModel getUser() {
        MessageSourceWrapper messageSourceWrapper = (MessageSourceWrapper) DynamicBeanProvider.getBean("messageSourceWrapper");
        String sessionName = messageSourceWrapper.getMessage("session.name");

        if (this.isAuthenticated()) {
            if (RequestContextHolder.getRequestAttributes().getAttribute(sessionName, RequestAttributes.SCOPE_SESSION) instanceof OprtrModel) {
                return (OprtrModel) RequestContextHolder.getRequestAttributes().getAttribute(sessionName, RequestAttributes.SCOPE_SESSION);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /*
     * (non-Javadoc)
     * @see grinbi.account.service.AccountService#isAuthenticated()
     */
    @Override
    public Boolean isAuthenticated() {

        MessageSourceWrapper messageSourceWrapper = (MessageSourceWrapper) DynamicBeanProvider.getBean("messageSourceWrapper");
        String sessionName = messageSourceWrapper.getMessage("session.name");

        if (RequestContextHolder.getRequestAttributes() == null) {
            return false;
        } else {
            return RequestContextHolder.getRequestAttributes().getAttribute(sessionName, RequestAttributes.SCOPE_SESSION) != null;
        }
    }

    /*
     * (non-Javadoc)
     * @see grinbi.account.service.AccountService#getRoles()
     */
    @SuppressWarnings("unchecked")
    @Override
    public List<RoleModel> getRoles() throws Exception {

        MessageSourceWrapper messageSourceWrapper = (MessageSourceWrapper) DynamicBeanProvider.getBean("messageSourceWrapper");
        String sessionName = messageSourceWrapper.getMessage("session.name");

        if (this.isAuthenticated()) {
            if (RequestContextHolder.getRequestAttributes().getAttribute(sessionName, RequestAttributes.SCOPE_SESSION) instanceof OprtrModel) {
                if (RequestContextHolder.getRequestAttributes().getAttribute("roleList", RequestAttributes.SCOPE_SESSION) instanceof List<?>) {
                    return (List<RoleModel>) RequestContextHolder.getRequestAttributes().getAttribute("roleList", RequestAttributes.SCOPE_SESSION);
                } else {
                    AbstractUserModel abstractUserModel = (OprtrModel) RequestContextHolder.getRequestAttributes().getAttribute(sessionName, RequestAttributes.SCOPE_SESSION);
                    List<RoleModel> roleList = this.getRolesWithUserId(abstractUserModel.getUserid());
                    RequestContextHolder.getRequestAttributes().setAttribute("roleList", roleList, RequestAttributes.SCOPE_SESSION);
                    return roleList;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /*
     * (non-Javadoc)
     * @see grinbi.account.service.AccountService#isInRoles(java.lang.String)
     */
    @Override
    public boolean isInRoles(String roleNames) {

        List<RoleModel> roles = null;
        try {
            roles = this.getRoles();
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (roles == null || StringUtils.isEmpty(roleNames)) {
            return false;
        }

        String[] arr = roleNames.split(",");
        for (int i = 0; i < arr.length; i++) {
            if (StringUtils.isEmpty(arr[i].trim())) {
                continue;
            }
            for (int j = 0; j < roles.size(); j++) {
                if (roles.get(j).getRoleNm().equals(arr[i])) {
                    return true;
                }
            }
        }
        return false;
    }

    /*
     * (non-Javadoc)
     * @see grinbi.account.service.AccountService#isInRoles(java.lang.String, java.lang.String)
     */
    @Override
    public boolean isInRoles(String roleNames, String userName) {

        if (StringUtils.isEmpty(userName)) {
            return false;
        }
        List<RoleModel> roles = null;
        try {
            roles = this.getRolesWithUserId(userName);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (roles == null || StringUtils.isEmpty(roleNames)) {
            return false;
        }

        String[] arr = roleNames.split(",");
        for (int i = 0; i < arr.length; i++) {
            if (StringUtils.isEmpty(arr[i].trim())) {
                continue;
            }
            for (int j = 0; j < roles.size(); j++) {
                if (roles.get(j).getRoleNm().equals(arr[i])) {
                    return true;
                }
            }
        }
        return false;
    }

    /*
     * (non-Javadoc)
     * @see grinbi.account.service.AccountService#getUser(java.lang.String)
     */
    @Override
    public OprtrModel getUser(String userId) {

        OprtrLoginModel loginModel = new OprtrLoginModel();
        loginModel.setUserid(userId);
        try {
            return null;// this.oprtrData.selectUser(loginModel);
        } catch (Exception e) {
            return null;
        }
    }


    /*
     * (non-Javadoc)
     * @see grinbi.account.service.AccountService#getAllRoles()
     */
    @Override
    public List<RoleModel> getAllRoles() {
        return null;//                this.oprtrData.selectAllRoles();
    }

    /*
     * (non-Javadoc)
     * @see grinbi.account.service.AccountService#getRolesOfMember(java.lang.String)
     */
    @Override
    public List<RoleModel> getRolesWithUserId(String userid) throws Exception {

        return this.oprtrData.selectUserRoles(userid);
    }
}
