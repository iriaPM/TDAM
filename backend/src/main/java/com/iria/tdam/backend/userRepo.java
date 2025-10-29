package com.iria.tdam.backend;

import org.springframework.data.jpa.repository.JpaRepository;

public interface userRepo extends JpaRepository<user, Long> {}