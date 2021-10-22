package oneEco.model.physical;

import grinbi.membership.AbstractUserModel;
import lombok.Data;

import java.util.Calendar;

@Data
public class OprtrModel extends AbstractUserModel {
    private  int oprtrPid;
    private int rolePid;
    private String userid;
    private String email;
    private String nationNo;
    private String telno;
    private Calendar creatDt;

    private String roleNm;
}
