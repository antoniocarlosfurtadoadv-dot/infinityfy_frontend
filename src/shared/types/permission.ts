export enum Permission {
  // 1. Requisições
  REQUISICOES_VISUALIZAR = "requisicoes:visualizar",
  REQUISICOES_GERENCIAR = "requisicoes:gerenciar",
  REQUISICOES_MARCAR_DESMARCAR_TODOS = "requisicoes:marcar_desmarcar_todos",

  // 2. Laudos e Pacientes
  PACIENTES_VISUALIZAR = "pacientes:visualizar",
  PACIENTES_GERENCIAR = "pacientes:gerenciar",
  PACIENTES_GERENCIAR_RESPONSAVEL = "pacientes:gerenciar_responsavel",
  PACIENTES_VISUALIZAR_HISTORICO = "pacientes:visualizar_historico",
  PACIENTES_DOWNLOAD_LAUDO_TRANSCRITO = "pacientes:download_laudo_transcrito",
  PACIENTES_DOWNLOAD_LAUDO_ORIGINAL = "pacientes:download_laudo_original",

  // 3. Triagem e Integração
  TRIAGEM_REALIZAR = "triagem:realizar",
  TRIAGEM_VALIDAR = "triagem:validar",
  TRIAGEM_REGISTRAR_INCONSISTENCIAS = "triagem:registrar_inconsistencias",
  TRIAGEM_VER_PENDENCIAS_VALIDACAO = "triagem:ver_pendencias_validacao",
  TRIAGEM_REPROCESSAR_JOB = "triagem:reprocessar_job",
  TRIAGEM_VER_REQUISICOES_VALIDADAS = "triagem:ver_requisicoes_validacao",
  TRIAGEM_REMOVER_REQUISICAO = "triagem:remover_requisicao",

  // 4. Rotas e Logística
  ROTAS_VISUALIZAR = "rotas:visualizar",
  ROTAS_GERENCIAR = "rotas:gerenciar",
  ROTAS_VINCULAR_MOTOBOY = "rotas:vincular_motoboy",
  ROTAS_VINCULAR_CLINICA = "rotas:vincular_clinica",
  ROTAS_DEFINIR_DATA = "rotas:definir_data",
  ROTAS_VINCULAR_REQUISICOES_COLETA = "rotas:vincular_requisicoes_coleta",
  COLETAS_VISUALIZAR = "coletas:visualizar",
  COLETAS_REGISTRAR = "coletas:registrar",
  COLETAS_INICIAR_ROTA = "coletas:iniciar_rota",
  COLETAS_SCAN_QRCODE = "coletas:scan_qr_codes",
  COLETAS_REGISTRAR_OCORRENCIA = "coletas:registrar_ocorrencia",

  // 5. Dashboard e Relatórios
  DASHBOARD_VISUALIZAR_OPERACIONAL = "dashboard:visualizar_operacional",
  DASHBOARD_VISUALIZAR_FINANCEIRO = "dashboard:visualizar_financeiro",
  RELATORIOS_EXPORTAR = "relatorios:exportar",

  // 6. Gestão do Sistema
  GESTAO_GERENCIAR_PERFIS = "gestao:gerenciar_perfis",
  GESTAO_GERENCIAR_USUARIOS = "gestao:gerenciar_usuarios",
  GESTAO_GERENCIAR_CLINICAS = "gestao:gerenciar_clinicas",
  GESTAO_VISUALIZAR_TABELA_PRECOS = "gestao:visualizar_tabela_precos",
  GESTAO_GERENCIAR_TABELA_PRECOS = "gestao:gerenciar_tabela_precos",
  GESTAO_VISUALIZAR_LOGS = "gestao:visualizar_logs_usuarios",
  GESTAO_RECEBER_NOTIFICACOES = "gestao:receber_notificacoes",

  // 7. Exames
  EXAMES_VISUALIZAR = "exames:visualizar",
  EXAMES_GERENCIAR = "exames:gerenciar",

  // 8. Veterinários
  VETERINARIOS_VISUALIZAR = "veterinarios:visualizar",
  VETERINARIOS_GERENCIAR = "veterinarios:gerenciar",
}
