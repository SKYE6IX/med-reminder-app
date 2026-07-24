const ru = {
  common: {
    next: "Дальше",
    form: {
      name_label: "Имя",
      name_placeholder: "Введите Ваше имя",
      email_label: "Почта",
      email_placeholder: "Введите адрес Вашей почты",
      password_label: "Пароль",
      password_placeholder: "Придумайте пароль",
    },
  },
  feedback: {
    error: {
      general: {
        title: "Ошибка!",
        text: "Что-то пошло не так. Пробовать снова.",
      },
      otp: {
        title: "Не удалось авторизовать!",
        text: "Просроченный или недействительный код.",
      },
      network: {
        title: "Ошибка сети!",
        text: "Проверьте подключение к интернету.",
      },
      authorized: {
        title: "Ошибка авторизации!",
        text: "Неверный адрес электронной почты или пароль.",
      },
    },
    success: {
      change_password: {
        title: "Success!",
        text: "Your password has been changed.",
      },
    },
  },
  onboarding: {
    step1: {
      title: "Ваше здоровье - в Ваших руках",
      text: "Возьмите под контроль свое самочувствие с помощью простых напоминаний о приеме лекарств.",
    },
    step2: {
      title: "Умные напоминания, простой контроль лекрств",
      text: "Следуйте графику спокойно и без лишних усилий — вы больше не пропустите приём лекарства.",
    },
    step3: {
      title: "Для Вас и Вашей семьи",
      text: "Легко управляйте приёмом лекарств для всех, о ком вы заботитесь.",
    },
    step4: {
      title: "Разрешить уведомления",
      text: "Уведомления будут приходить согласно вашим настройкам.",
    },
  },
  welcome_screen: {
    heading: "Контролируйте прием Ваших лекарств просто",
    text: "Все ваши таблетки в одном месте.",
    create_account_btn: "Создать аккаунт",
    sign_in_btn: "Войти в аккаунт",
  },
  sign_up_screen: {
    title: "Создать аккаунт",
    sub_title: "Заполните Ваши данные",
    create_account_btn: "Создать аккаунт",
    terms_and_policy:
      "Создавая аккаунт, Вы принимаете <termsLink>Условия использования</termsLink> и <privacyLink>Политику конфиденциальности</privacyLink>.",
    or: "Или",
    have_account: "Уже есть аккаунт?",
    sign_in: "Войти",
  },
  sign_in_screen: {
    title: "Войти",
    sub_title: "Введите данные для входа в аккаунт",
    sign_in_btn: "Войти",
    forget_password: "Забыли пароль?",
    click_here: "Нажмите здесь",
    or: "Или",
    no_account: "Нет аккаунта?",
    sign_up: "Создать аккаунт",
  },
  forget_passowrd_screen: {
    step1: {
      title: "Забыли пароль",
      text: "Введите данные для восстановления аккаунта",
      recover: "Восстановить пароль",
    },
    step2: {
      title: "Введите код",
      text: "Мы отправили код подтверждения на вашу почту {{email}} ",
      change_email: "Изменить",
      continue: "Продолжить",
      no_code: "Не получили код?",
      request_again: "Отправить повторно",
      try_again: "Ещё раз через {{time}}",
    },
    setp3: {
      title: "Новый пароль",
      text: "Введите новый пароль",
      new_password_label: "Новый пароль",
      new_password_placeholder: "Придумайте пароль",
      confirm_password_label: "Подтвердите новый пароль",
      confirm_password_placholder: "Повторите пароль",
      submit_text: "Создать новый пароль",
    },
  },
} as const;

export default ru;
export type Translation = typeof ru;
