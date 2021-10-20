package oneEco.model;

import grinbi.validation.annotation.Required;
import lombok.Data;

@Data
public class AdminLoginModel {
    @Required()
    private String userId;
    @Required()
    private String password;
}
