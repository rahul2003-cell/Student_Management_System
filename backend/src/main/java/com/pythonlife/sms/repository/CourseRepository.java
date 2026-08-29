package com.pythonlife.sms.repository;

import com.pythonlife.sms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseNameIgnoreCase(String courseName);
    boolean existsByCourseNameIgnoreCase(String courseName);
}
