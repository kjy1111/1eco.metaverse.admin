package oneEco.service;

import grinbi.membership.MembershipService;
import oneEco.model.AdminRoleModel;

import java.util.List;

public interface AdminUserService extends MembershipService {



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
    List<AdminRoleModel> getRoles();

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
    List<AdminRoleModel> getAllRoles() throws Exception;


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
    List<AdminRoleModel> getRolesWithUserId(String userId) throws Exception;

}
