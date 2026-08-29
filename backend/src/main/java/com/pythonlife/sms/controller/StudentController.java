package com.pythonlife.sms.controller;

import com.pythonlife.sms.dto.ApiResponse;
import com.pythonlife.sms.dto.DashboardStatsDto;
import com.pythonlife.sms.dto.StudentRequestDto;
import com.pythonlife.sms.dto.StudentResponseDto;
import com.pythonlife.sms.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/v1/students")
@RequiredArgsConstructor
@Validated
@Tag(name = "Student Management", description = "APIs for managing students")
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @Operation(summary = "Create a new student")
    public ResponseEntity<ApiResponse<StudentResponseDto>> createStudent(
            @Valid @RequestBody StudentRequestDto requestDto) {
        StudentResponseDto created = studentService.createStudent(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student created successfully", created));
    }

    @GetMapping
    @Operation(summary = "Get all students, optionally filter by course/status/search keyword")
    public ResponseEntity<ApiResponse<List<StudentResponseDto>>> getAllStudents(
            @RequestParam(required = false) String course,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        List<StudentResponseDto> students;
        if (search != null && !search.isEmpty()) {
            students = studentService.searchStudents(search);
        } else if (course != null && !course.isEmpty()) {
            students = studentService.getStudentsByCourse(course);
        } else if (status != null && !status.isEmpty()) {
            students = studentService.getStudentsByStatus(status);
        } else {
            students = studentService.getAllStudents();
        }
        return ResponseEntity.ok(ApiResponse.success("Students fetched successfully", students));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a student by ID")
    public ResponseEntity<ApiResponse<StudentResponseDto>> getStudentById(@PathVariable Long id) {
        StudentResponseDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student fetched successfully", student));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing student")
    public ResponseEntity<ApiResponse<StudentResponseDto>> updateStudent(
            @PathVariable Long id, @Valid @RequestBody StudentRequestDto requestDto) {
        StudentResponseDto updated = studentService.updateStudent(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a student")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        DashboardStatsDto stats = studentService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched successfully", stats));
    }
}
