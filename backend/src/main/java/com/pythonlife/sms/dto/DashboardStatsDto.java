package com.pythonlife.sms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private long totalStudents;
    private long activeStudents;
    private long inactiveStudents;
    private long totalCourses;
    private Map<String, Long> studentsByCourse;
}
