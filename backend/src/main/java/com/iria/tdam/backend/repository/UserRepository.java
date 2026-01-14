//user repository 
package com.iria.tdam.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.iria.tdam.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    User findByUsername(String username);

    User findByToken(String token);

    User findByEmailOrUsername(String email, String username);
}
