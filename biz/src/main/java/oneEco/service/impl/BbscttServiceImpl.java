package oneEco.service.impl;

import oneEco.data.BbscttData;
import oneEco.model.logical.BbscttSearchModel;
import oneEco.model.physical.BbscttModel;
import oneEco.service.BbscttService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BbscttServiceImpl  implements BbscttService {

    @Autowired
    private BbscttData bbscttData;

    @Override
    public int add(BbscttModel model) throws Exception {
        return this.bbscttData.insert(model);
    }

    @Override
    public void modify(BbscttModel model) {

    }

    @Override
    public void remove(int bbsPid) {

    }

    @Override
    public BbscttModel getBbsctt(BbscttModel model) throws Exception {
        return this.bbscttData.getBbsctt(model);
    }

    @Override
    public int getBbscttListCount(BbscttSearchModel model) throws Exception {
        return this.bbscttData.getBbscttListCount(model);
    }

    @Override
    public List<BbscttModel> getBbscttList(BbscttSearchModel model) throws Exception {
        return this.bbscttData.getBbscttList(model);
    }

    @Override
    public BbscttModel getPrevBbsctt(BbscttSearchModel model) {
        return null;
    }

    @Override
    public BbscttModel getNextBbsctt(BbscttSearchModel model) {
        return null;
    }
}
