package oneEco.data;

import grinbi.database.AbstractMybatisMapper;
import oneEco.model.logical.OprtrLoginModel;
import oneEco.model.physical.RoleModel;
import oneEco.model.physical.OprtrModel;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class OprtrData extends AbstractMybatisMapper {

    public OprtrModel login(OprtrLoginModel model) throws Exception {
        return this.selectOne("oprtr.Login", model);
    }
    public List<RoleModel> selectUserRoles(String userid) throws Exception {
        return this.selectList("oprtr.GetUserRoles", userid);
    }
}
