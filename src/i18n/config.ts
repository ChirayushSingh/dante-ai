import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        welcome: "Welcome to Aura Health",
        login: "Login",
        logout: "Logout",
        signup: "Sign Up",
        profile: "Profile",
        settings: "Settings",
        home: "Home",
        about: "About",
        contact: "Contact",
        language: "Language"
      },
      health: {
        symptoms: "Symptoms",
        assessment: "Health Assessment",
        consultation: "Voice Consultation",
        bodyMap: "Body Map",
        vitals: "Health Vitals",
        chatbot: "Health Chatbot",
        doctor: "Doctor Portal",
        appointment: "Book Appointment",
        medical_history: "Medical History",
        prescriptions: "Prescriptions"
      },
      dashboard: {
        overview: "Overview",
        analytics: "Analytics",
        reports: "Reports",
        export: "Export Data",
        timeline: "Health Timeline"
      },
      messages: {
        success: "Operation successful",
        error: "An error occurred",
        loading: "Loading...",
        processing: "Processing...",
        saving: "Saving..."
      }
    }
  },
  es: {
    translation: {
      common: {
        welcome: "Bienvenido a Aura Health",
        login: "Iniciar sesión",
        logout: "Cerrar sesión",
        signup: "Registrarse",
        profile: "Perfil",
        settings: "Configuración",
        home: "Inicio",
        about: "Acerca de",
        contact: "Contacto",
        language: "Idioma"
      },
      health: {
        symptoms: "Síntomas",
        assessment: "Evaluación de Salud",
        consultation: "Consulta de Voz",
        bodyMap: "Mapa Corporal",
        vitals: "Signos Vitales",
        chatbot: "Chatbot de Salud",
        doctor: "Portal del Doctor",
        appointment: "Reservar Cita",
        medical_history: "Historial Médico",
        prescriptions: "Recetas"
      },
      dashboard: {
        overview: "Descripción General",
        analytics: "Análisis",
        reports: "Reportes",
        export: "Exportar Datos",
        timeline: "Línea de Tiempo de Salud"
      },
      messages: {
        success: "Operación exitosa",
        error: "Ocurrió un error",
        loading: "Cargando...",
        processing: "Procesando...",
        saving: "Guardando..."
      }
    }
  },
  fr: {
    translation: {
      common: {
        welcome: "Bienvenue dans Aura Health",
        login: "Connexion",
        logout: "Déconnexion",
        signup: "S'inscrire",
        profile: "Profil",
        settings: "Paramètres",
        home: "Accueil",
        about: "À propos",
        contact: "Contact",
        language: "Langue"
      },
      health: {
        symptoms: "Symptômes",
        assessment: "Évaluation de la Santé",
        consultation: "Consultation Vocale",
        bodyMap: "Carte Corporelle",
        vitals: "Signes Vitaux",
        chatbot: "Chatbot Santé",
        doctor: "Portail Médecin",
        appointment: "Prendre Rendez-vous",
        medical_history: "Historique Médical",
        prescriptions: "Ordonnances"
      },
      dashboard: {
        overview: "Vue d'ensemble",
        analytics: "Analyses",
        reports: "Rapports",
        export: "Exporter les Données",
        timeline: "Chronologie Santé"
      },
      messages: {
        success: "Opération réussie",
        error: "Une erreur s'est produite",
        loading: "Chargement...",
        processing: "Traitement...",
        saving: "Enregistrement..."
      }
    }
  },
  de: {
    translation: {
      common: {
        welcome: "Willkommen bei Aura Health",
        login: "Anmelden",
        logout: "Abmelden",
        signup: "Registrieren",
        profile: "Profil",
        settings: "Einstellungen",
        home: "Startseite",
        about: "Über uns",
        contact: "Kontakt",
        language: "Sprache"
      },
      health: {
        symptoms: "Symptome",
        assessment: "Gesundheitsbewertung",
        consultation: "Sprachkonsultation",
        bodyMap: "Körperkarte",
        vitals: "Vitalzeichen",
        chatbot: "Gesundheits-Chatbot",
        doctor: "Ärzte-Portal",
        appointment: "Termin buchen",
        medical_history: "Krankengeschichte",
        prescriptions: "Rezepte"
      },
      dashboard: {
        overview: "Übersicht",
        analytics: "Analytik",
        reports: "Berichte",
        export: "Daten exportieren",
        timeline: "Gesundheitsverlauf"
      },
      messages: {
        success: "Operation erfolgreich",
        error: "Ein Fehler ist aufgetreten",
        loading: "Wird geladen...",
        processing: "Wird verarbeitet...",
        saving: "Wird gespeichert..."
      }
    }
  },
  zh: {
    translation: {
      common: {
        welcome: "欢迎来到光环健康",
        login: "登录",
        logout: "登出",
        signup: "注册",
        profile: "档案",
        settings: "设置",
        home: "首页",
        about: "关于",
        contact: "联系",
        language: "语言"
      },
      health: {
        symptoms: "症状",
        assessment: "健康评估",
        consultation: "语音咨询",
        bodyMap: "身体图谱",
        vitals: "健康指标",
        chatbot: "健康聊天机器人",
        doctor: "医生门户",
        appointment: "预约",
        medical_history: "医疗历史",
        prescriptions: "处方"
      },
      dashboard: {
        overview: "概览",
        analytics: "分析",
        reports: "报告",
        export: "导出数据",
        timeline: "健康时间线"
      },
      messages: {
        success: "操作成功",
        error: "发生错误",
        loading: "加载中...",
        processing: "处理中...",
        saving: "保存中..."
      }
    }
  },
  ja: {
    translation: {
      common: {
        welcome: "オーラヘルスへようこそ",
        login: "ログイン",
        logout: "ログアウト",
        signup: "サインアップ",
        profile: "プロフィール",
        settings: "設定",
        home: "ホーム",
        about: "について",
        contact: "お問い合わせ",
        language: "言語"
      },
      health: {
        symptoms: "症状",
        assessment: "健康評価",
        consultation: "音声相談",
        bodyMap: "ボディマップ",
        vitals: "健康バイタル",
        chatbot: "健康チャットボット",
        doctor: "医師ポータル",
        appointment: "予約",
        medical_history: "医療履歴",
        prescriptions: "処方箋"
      },
      dashboard: {
        overview: "概要",
        analytics: "分析",
        reports: "レポート",
        export: "データをエクスポート",
        timeline: "健康タイムライン"
      },
      messages: {
        success: "操作が正常に完了しました",
        error: "エラーが発生しました",
        loading: "読み込み中...",
        processing: "処理中...",
        saving: "保存中..."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
