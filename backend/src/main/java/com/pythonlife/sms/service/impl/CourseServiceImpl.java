package com.pythonlife.sms.service.impl;

import com.pythonlife.sms.entity.Course;
import com.pythonlife.sms.exception.DuplicateResourceException;
import com.pythonlife.sms.exception.ResourceNotFoundException;
import com.pythonlife.sms.repository.CourseRepository;
import com.pythonlife.sms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    public Course createCourse(Course course) {
        if (courseRepository.existsByCourseNameIgnoreCase(course.getCourseName())) {
            throw new DuplicateResourceException("Course '" + course.getCourseName() + "' already exists");
        }
        return courseRepository.save(course);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    }

    @Override
    public Course updateCourse(Long id, Course course) {
        Course existing = getCourseById(id);
        existing.setCourseName(course.getCourseName());
        existing.setDurationMonths(course.getDurationMonths());
        existing.setFeeAmount(course.getFeeAmount());
        existing.setDescription(course.getDescription());
        return courseRepository.save(existing);
    }

    @Override
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course", "id", id);
        }
        courseRepository.deleteById(id);
    }
}
