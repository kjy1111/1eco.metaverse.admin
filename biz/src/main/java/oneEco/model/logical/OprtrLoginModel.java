package oneEco.model.logical;

import grinbi.validation.annotation.Required;
import lombok.Data;

@Data
public class OprtrLoginModel {
    @Required()
    private String userid;
    @Required()
    private String password;
}
