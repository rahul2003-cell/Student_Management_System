package com.pythonlife.sms.repository;

import com.pythonlife.sms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {

    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Student> findByCourseIgnoreCase(String course);

    List<Student> findByStatusIgnoreCase(String status);

    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    long countByStatusIgnoreCase(String status);

    long countByCourseIgnoreCase(String course);
}
