package oneEco.service;

import oneEco.model.logical.BbscttSearchModel;
import oneEco.model.physical.BbscttModel;

import java.util.List;
import java.util.Map;

public interface BbscttService {
    int add(BbscttModel model) throws Exception;

    void modify(BbscttModel model);

    void remove(int bbsPid);

    BbscttModel getBbsctt(BbscttModel model) throws Exception;

    int getBbscttListCount(BbscttSearchModel model) throws Exception;

    List<BbscttModel> getBbscttList(BbscttSearchModel model) throws Exception;

    BbscttModel getPrevBbsctt(BbscttSearchModel model);

    BbscttModel getNextBbsctt(BbscttSearchModel model);
}
