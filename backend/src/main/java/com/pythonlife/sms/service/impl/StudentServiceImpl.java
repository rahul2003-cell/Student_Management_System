package com.pythonlife.sms.service.impl;

import com.pythonlife.sms.dto.DashboardStatsDto;
import com.pythonlife.sms.dto.StudentRequestDto;
import com.pythonlife.sms.dto.StudentResponseDto;
import com.pythonlife.sms.entity.Student;
import com.pythonlife.sms.exception.DuplicateResourceException;
import com.pythonlife.sms.exception.ResourceNotFoundException;
import com.pythonlife.sms.repository.StudentRepository;
import com.pythonlife.sms.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public StudentResponseDto createStudent(StudentRequestDto requestDto) {
        if (studentRepository.existsByEmail(requestDto.getEmail())) {
            throw new DuplicateResourceException("A student with email '" + requestDto.getEmail() + "' already exists");
        }

        Student student = Student.builder()
                .firstName(requestDto.getFirstName())
                .lastName(requestDto.getLastName())
                .email(requestDto.getEmail())
                .phone(requestDto.getPhone())
                .dateOfBirth(requestDto.getDateOfBirth())
                .address(requestDto.getAddress())
                .course(requestDto.getCourse())
                .enrollmentDate(requestDto.getEnrollmentDate())
                .status(StringUtils.hasText(requestDto.getStatus()) ? requestDto.getStatus() : "ACTIVE")
                .build();

        Student saved = studentRepository.save(student);
        return mapToResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return mapToResponseDto(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> searchStudents(String keyword) {
        return studentRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(keyword, keyword)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> getStudentsByCourse(String course) {
        return studentRepository.findByCourseIgnoreCase(course)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> getStudentsByStatus(String status) {
        return studentRepository.findByStatusIgnoreCase(status)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponseDto updateStudent(Long id, StudentRequestDto requestDto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        if (!student.getEmail().equalsIgnoreCase(requestDto.getEmail())
                && studentRepository.existsByEmail(requestDto.getEmail())) {
            throw new DuplicateResourceException("A student with email '" + requestDto.getEmail() + "' already exists");
        }

        student.setFirstName(requestDto.getFirstName());
        student.setLastName(requestDto.getLastName());
        student.setEmail(requestDto.getEmail());
        student.setPhone(requestDto.getPhone());
        student.setDateOfBirth(requestDto.getDateOfBirth());
        student.setAddress(requestDto.getAddress());
        student.setCourse(requestDto.getCourse());
        if (requestDto.getEnrollmentDate() != null) {
            student.setEnrollmentDate(requestDto.getEnrollmentDate());
        }
        if (StringUtils.hasText(requestDto.getStatus())) {
            student.setStatus(requestDto.getStatus());
        }

        Student updated = studentRepository.save(student);
        return mapToResponseDto(updated);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student", "id", id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long total = studentRepository.count();
        long active = studentRepository.countByStatusIgnoreCase("ACTIVE");
        long inactive = studentRepository.countByStatusIgnoreCase("INACTIVE");

        Map<String, Long> byCourse = studentRepository.findAll().stream()
                .collect(Collectors.groupingBy(Student::getCourse, HashMap::new, Collectors.counting()));

        long totalCourses = byCourse.size();

        return DashboardStatsDto.builder()
                .totalStudents(total)
                .activeStudents(active)
                .inactiveStudents(inactive)
                .totalCourses(totalCourses)
                .studentsByCourse(byCourse)
                .build();
    }

    private StudentResponseDto mapToResponseDto(Student student) {
        return StudentResponseDto.builder()
                .id(student.getId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .fullName(student.getFirstName() + " " + student.getLastName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .dateOfBirth(student.getDateOfBirth())
                .address(student.getAddress())
                .course(student.getCourse())
                .enrollmentDate(student.getEnrollmentDate())
                .status(student.getStatus())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}
