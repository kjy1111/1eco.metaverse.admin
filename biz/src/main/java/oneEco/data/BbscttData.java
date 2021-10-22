package oneEco.data;

import grinbi.database.AbstractMybatisMapper;
import oneEco.model.logical.BbscttSearchModel;
import oneEco.model.physical.BbscttModel;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BbscttData extends AbstractMybatisMapper {

    public List<BbscttModel> getBbscttList(BbscttSearchModel model) throws Exception {
        return this.selectList("bbsctt.GetBbscttList", model);
    }

    public int getBbscttListCount(BbscttSearchModel model) throws Exception {
        return this.selectOne("bbsctt.GetBbscttListCount", model);
    }

    public BbscttModel getBbsctt(BbscttModel model) throws Exception {
        return this.selectOne("bbsctt.GetBbsctt", model);
    }
    public int insert(BbscttModel model) throws Exception {
        model.setBbscttPid( this.insert("bbsctt.Insert", model));
        return this.insert("bbsctt.InsertTrnslat", model);
    }
}
