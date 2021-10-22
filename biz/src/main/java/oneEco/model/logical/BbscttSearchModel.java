package oneEco.model.logical;

import lombok.Data;

@Data
public class BbscttSearchModel {
    private int bbscttPid;
    private String ctgry;
    private String searchCode;
    private String searchText;
    private int pageNumber;
    private int pageSize;
    private int offset;
    private int limit;
}
