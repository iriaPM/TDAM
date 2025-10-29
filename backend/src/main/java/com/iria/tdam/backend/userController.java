package com.iria.tdam.backend;


import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class userController {

    private final userRepo userRepo;

    public userController(userRepo userRepo) {
        this.userRepo = userRepo;
    }

    @PostMapping
    public user createUser(@RequestParam String name) {
        return userRepo.save(new user(name));
    }

    @GetMapping
    public List<user> getUsers() {
        return userRepo.findAll();
    }
}