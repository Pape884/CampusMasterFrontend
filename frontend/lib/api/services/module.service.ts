import apiClient from "@/lib/api/axios/client"
import { Module, CreateModuleRequest, UpdateModuleRequest, modulesResponse } from "."



class ModuleService {

  private readonly baseUrl = "/modules"

  /* 🔹 Récupérer tous les modules */
  async getAll(): Promise<Module[]> {
    const { data } = await apiClient.get(this.baseUrl)
    return data.data
  }

  /* 🔹 Récupérer les modules d’un département */
  async getByDepartment(departmentId: string): Promise<Module[]> {
    const { data } = await apiClient.get(
      `${this.baseUrl}?departmentId=${departmentId}`
    )
    return data.data
  }

  /* 🔹 Récupérer un module par ID */
  async getById(id: string): Promise<Module> {
    const { data } = await apiClient.get(`${this.baseUrl}/${id}`)
    return data
  }

  /* 🔹 Créer un module */
  async create(payload: CreateModuleRequest): Promise<Module> {
    const { data } = await apiClient.post(this.baseUrl, payload)
    return data
  }

  /* 🔹 Mettre à jour un module */
  async update(
    id: string,
    payload: UpdateModuleRequest
  ): Promise<Module> {
    const { data } = await apiClient.put(
      `${this.baseUrl}/${id}`,
      payload
    )
    return data
  }

  /* 🔹 Supprimer un module */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`)
  }

  /* 🔹 Activer / Désactiver */
  async toggleStatus(id: string, isActive: boolean): Promise<Module> {
    const { data } = await apiClient.patch(
      `${this.baseUrl}/${id}/status`,
      { isActive }
    )
    return data
  }
}

/* =========================
   EXPORT
========================= */

export const moduleService = new ModuleService()
