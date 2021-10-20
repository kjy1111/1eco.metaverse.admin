package oneEco.model;

import grinbi.membership.AbstractUserModel;
import lombok.Data;

@Data
public class AdminUserModel extends AbstractUserModel {
    private  int userPid;
}
