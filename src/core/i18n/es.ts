/** All UI strings in Spanish. */
/** Spanish translations for the entire app. */
export const strings = {
  common: {
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Buscar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
  },

  auth: {
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    forgotPassword: '¿Olvidaste tu contraseña?',
    email: 'Correo electrónico',
    password: 'Contraseña',
    username: 'Nombre de usuario',
    dateOfBirth: 'Fecha de nacimiento',
  },

  chat: {
    header: {
      lastSeen: 'visto recientemente',
      members: '{count} miembros',
      online: 'en línea',
    },
    input: {
      placeholder: 'Mensaje...',
      placeholderBlocked: 'No puedes enviar mensajes a este usuario',
      limitReached: 'Límite Alcanzado',
      invalidMessage: 'Mensaje Inválido',
    },
    actions: {
      reply: 'Responder',
      deleteForEveryone: 'Eliminar para Todos',
      deleteForMe: 'Eliminar para Mí',
      copy: 'Copiar',
      forward: 'Reenviar',
      clearChat: 'Limpiar Chat',
      block: 'Bloquear',
      unblock: 'Desbloquear',
      leaveGroup: 'Salir del Grupo',
      addMembers: 'Agregar Miembros',
      muteNotifications: 'Silenciar Notificaciones',
      searchChat: 'Buscar en el Chat',
      report: 'Reportar',
      leaveGroupConfirmTitle: 'Salir del Grupo',
      leaveGroupConfirmMessage: '¿Estás seguro de que quieres salir de este grupo?',
      leaveConfirm: 'Salir',
      blockUser: 'Bloquear Usuario',
      removeFromGroup: 'Eliminar del Grupo',
      promoteToAdmin: 'Ascender a Admin',
      demoteToMember: 'Degradar a Miembro',
      noMoreUsers: 'No hay más usuarios para agregar',
    },
    status: {
      sending: 'Enviando...',
      sent: 'Enviado',
      delivered: 'Entregado',
      read: 'Leído',
    },
    empty: {
      noChats: 'Sin chats aún',
      searchPrompt: 'Busca arriba para encontrar conversaciones',
      noMessages: 'No hay mensajes aún',
    },
    info: {
      members: '{count} miembros',
      media: 'Multimedia',
      files: 'Archivos',
      links: 'Enlaces',
      message: 'Mensaje',
      mute: 'Silenciar',
      add: 'Agregar',
      remove: 'Eliminar',
      noMoreUsers: 'No hay más usuarios para agregar',
    },
    group: {
      create: 'Crear Grupo',
      nameRequired: 'El nombre del grupo es obligatorio.',
      validation: 'Validación',
      owner: 'Propietario',
      admin: 'Admin',
      member: 'Miembro',
    },
    time: {
      yesterday: 'Ayer',
      today: 'Hoy',
    },
  },

  feed: {
    like: 'Me gusta',
    comment: 'Comentar',
    share: 'Compartir',
    bookmark: 'Guardar',
  },

  profile: {
    edit: 'Editar Perfil',
    settings: 'Configuración',
    favoriteGames: 'Juegos Favoritos',
    changePassword: 'Cambiar Contraseña',
    logout: 'Cerrar Sesión',
  },

  notifications: {
    title: 'Notificaciones',
    followRequest: 'quiere seguirte',
    likedPost: 'le gustó tu publicación',
    commentedPost: 'comentó en tu publicación',
    empty: 'No tienes notificaciones',
  },
} as const;
