package oneEco.service.impl;

import grinbi.membership.AbstractUserModel;
import grinbi.message.MessageSourceWrapper;
import grinbi.utility.bean.DynamicBeanProvider;
import oneEco.data.AdminUserData;
import oneEco.model.AdminLoginModel;
import oneEco.model.AdminRoleModel;
import oneEco.model.AdminUserModel;
import oneEco.service.AdminUserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.List;

@Service("userServiceImpl")
public class AdminUserServiceImpl implements AdminUserService {

    @Autowired
    private AdminUserData UserData;


    /*
     * (non-Javadoc)
     * @see grinbi.account.service.AccountService#getUser()
     */
    @Override
    public AdminUserModel getUser() {
        MessageSourceWrapper messageSourceWrapper = (MessageSourceWrapper) DynamicBeanProvider.getBean("messageSourceWrapper");
        String sessionName = messageSourceWrapper.getMessage("session.name");

        if (this.isAuthenticated()) {
            if (RequestContextHolder.getRequestAttributes().getAttribute(sessionName, RequestAttributes.SCOPE_SESSION) instanceof AdminUserModel) {
                return (AdminUserModel) RequestContextHolder.getRequestAttributes().getAttribute(sessionName, RequestAttributes.SCOPE_SESSION);
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
    public List<AdminRoleModel> getRoles() {

        MessageSourceWrapper messageSourceWrapper = (MessageSourceWrapper) DynamicBeanProvider.getBean("messageSourceWrapper");
        String sessionName = messageSourceWrapper.getMessage("session.name");

        if (this.isAuthenticated()) {
            if (RequestContextHolder.getRequestAttributes().getAttribute(sessionName, RequestAttributes.SCOPE_SESSION) instanceof AdminUserModel) {
                if (RequestContextHolder.getRequestAttributes().getAttribute("roleList", RequestAttributes.SCOPE_SESSION) instanceof List<?>) {
                    return (List<AdminRoleModel>) RequestContextHolder.getRequestAttributes().getAttribute("roleList", RequestAttributes.SCOPE_SESSION);
                } else {
                    AbstractUserModel abstractUserModel = (AdminUserModel) RequestContextHolder.getRequestAttributes().getAttribute(sessionName, RequestAttributes.SCOPE_SESSION);
                    List<AdminRoleModel> roleList = this.getRolesWithUserId(abstractUserModel.getUserid());
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

        List<AdminRoleModel> roles = this.getRoles();
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
        List<AdminRoleModel> roles = this.getRolesWithUserId(userName);
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
    public AdminUserModel getUser(String userId) {

        AdminLoginModel loginModel = new AdminLoginModel();
        loginModel.setUserId(userId);
        try {
            return this.UserData.selectUser(loginModel);
        } catch (Exception e) {
            return null;
        }
    }


    /*
     * (non-Javadoc)
     * @see grinbi.account.service.AccountService#getAllRoles()
     */
    @Override
    public List<AdminRoleModel> getAllRoles() {
        return this.UserData.selectAllRoles();
    }

    /*
     * (non-Javadoc)
     * @see grinbi.account.service.AccountService#getRolesOfMember(java.lang.String)
     */
    @Override
    public List<AdminRoleModel> getRolesWithUserId(String userId) {
        return this.UserData.selectUserRoles(userId);
    }
}
