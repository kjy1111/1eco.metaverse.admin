package oneEco.service;

import grinbi.membership.MembershipService;
import oneEco.model.logical.OprtrLoginModel;
import oneEco.model.physical.OprtrModel;
import oneEco.model.physical.RoleModel;

import java.util.List;

public interface OprtrService extends MembershipService {


    OprtrModel login(OprtrLoginModel model) throws Exception;

    /**
     * 인증된  사용자의 전체 역할정보를 가져옵니다.
     *
     * @return roles
     *
     * <pre>
     *     수정일 수정자 수정내용
     *     ------- -------- ---------------------------
     *     2020-05-11 BangEunLee 최초생성
     * </pre>
     */
    List<RoleModel> getRoles() throws Exception;

    /**
     * 전체 역할 정보를 가져옵니다.
     *
     * @return all roles
     * @throws Exception the exception
     *
     *                   <pre>
     *                       수정일 수정자 수정내용
     *                       ------- -------- ---------------------------
     *                       2020-05-11 BangEunLee 최초생성
     *                   </pre>
     */
    List<RoleModel> getAllRoles() throws Exception;


    /**
     * 해당된 사용자의 전체 역할을 가져옵니다.
     *
     * @param userId the user Id
     * @return roles of member
     * @throws Exception the exception
     *
     *                   <pre>
     *                       수정일 수정자 수정내용
     *                       ------- -------- ---------------------------
     *                       2020-05-11 BangEunLee 최초생성
     *                   </pre>
     */
    List<RoleModel> getRolesWithUserId(String userId) throws Exception;

}
