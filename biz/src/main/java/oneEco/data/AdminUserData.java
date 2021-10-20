package oneEco.data;

import grinbi.database.AbstractMybatisMapper;
import oneEco.model.AdminLoginModel;
import oneEco.model.AdminRoleModel;
import oneEco.model.AdminUserModel;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class AdminUserData extends AbstractMybatisMapper {

    /**
     * @param LoginModel the grinbi login model
     * @return the grinbi user model
     * @throws Exception the exception
     */
    public AdminUserModel selectUser(AdminLoginModel LoginModel) throws Exception {
        return this.selectOne("grinbi.User.getUser", LoginModel);
    }

    /**
     * @return the list
     */
    public List<AdminRoleModel> selectAllRoles() {

        List<AdminRoleModel> roleList = new ArrayList<AdminRoleModel>();
        AdminRoleModel RoleModel = new AdminRoleModel();
        RoleModel.setRoleNm("Admin");
        roleList.add(RoleModel);
        return roleList;
    }

    /*
     * (non-Javadoc)
     * @see grinbi.account.dao.IAccountDao#selectUserRoles(java.lang.String)
     */
    public List<AdminRoleModel> selectUserRoles(String userName) {

        List<AdminRoleModel> roleList = new ArrayList<AdminRoleModel>();
        AdminRoleModel RoleModel = new AdminRoleModel();
        RoleModel.setRoleNm("Admin");
        roleList.add(RoleModel);
        return roleList;
    }

}
