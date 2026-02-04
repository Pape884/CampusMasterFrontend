import { Module } from "."
import apiClient from "../axios/client"


class EnrollmentService {
    
    private readonly baseUrl = "/enrollments"
    
    //recuperer les modules affecter a un enseingant
    async getTeacherModules(teacherId: string): Promise<Module[]> {
        const { data } = await apiClient.get(
            `${this.baseUrl}/teachers/${teacherId}/modules`
        )
        return data
    }


}

export const enrollmentService = new EnrollmentService()