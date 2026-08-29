package com.pythonlife.sms.service;

import com.pythonlife.sms.dto.DashboardStatsDto;
import com.pythonlife.sms.dto.StudentRequestDto;
import com.pythonlife.sms.dto.StudentResponseDto;

import java.util.List;

public interface StudentService {

    StudentResponseDto createStudent(StudentRequestDto requestDto);

    StudentResponseDto getStudentById(Long id);

    List<StudentResponseDto> getAllStudents();

    List<StudentResponseDto> searchStudents(String keyword);

    List<StudentResponseDto> getStudentsByCourse(String course);

    List<StudentResponseDto> getStudentsByStatus(String status);

    StudentResponseDto updateStudent(Long id, StudentRequestDto requestDto);

    void deleteStudent(Long id);

    DashboardStatsDto getDashboardStats();
}
