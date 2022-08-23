export default {
    agent_campaign: {
        name: 'نام',
        username: 'Username',
        sip: 'ID SIP',
        penalty: 'هزینه جریمه'
    },
    pause_set: {
        id: 'شناسه',
        name: 'نام'
    },
    pause_setting: {
        id: 'شناسه',
        pause: 'مکث',
        pause_type: 'نوع مکث',
        set: 'تنظیم',
        time_to_end_pause: 'زمان پایان دادن به مکث'
    },
    audit: {
        user: 'کاربر',
        object: 'هدف - شی',
        name: 'نام',
        action: 'عمل',
        additional_information: 'تغییر دادن',
        datetime: 'تاریخ و زمان'
    },
    external_site: {
        id: 'برو',
        name: 'نام',
        url: 'URL',
        method: 'روش',
        format: 'قالب',
        objective: 'هدف',
        trigger: 'ماشه',
        status: 'شرایط. شرط'
    },
    call_disposition: {
        id: 'شناسه',
        name: 'نام'
    },
    external_system: {
        id: 'برو',
        name: 'نام',
        agents: 'عامل'
    },
    agent_external_system: {
        id: 'برو',
        external_id: 'شناسه خارجی نماینده',
        agent: 'عامل'
    },
    form: {
        id: 'برو',
        name: 'نام',
        description: 'شرح',
        fields: 'زمینه های',
        status: 'وضعیت'
    },
    form_field: {
        id: 'برو',
        name: 'نام',
        order: 'سفارش',
        type: 'پسر',
        required: 'اجباری است',
        list_options: 'گزینه های لیست'
    },
    pause: {
        id: 'برو',
        name: 'نام',
        type: 'پسر',
        status: 'وضعیت'
    },
    inbound_route: {
        id: 'برو',
        name: 'نام',
        phone: 'شماره DID',
        caller_id: 'پیشوند',
        idiom: 'اصطلاح',
        destiny: 'سرنوشت',
        destiny_type: 'نوع مقصد'
    },
    outbound_route: {
        id: 'برو',
        name: 'نام',
        ring_time: 'زمان زنگ زدن',
        dial_options: 'گزینه های شماره گیری',
        order: 'سفارش'
    },
    dial_pattern: {
        id: 'برو',
        prepend: 'آماده کردن',
        prefix: 'پیشوند',
        pattern: 'الگوی شماره گیری',
        order: 'سفارش'
    },
    trunk: {
        id: 'برو',
        name: 'نام',
        order: 'سفارش'
    },
    group_of_hour: {
        id: 'برو',
        name: 'نام',
        time_validations: 'شرایط آب و هوایی'
    },
    time_validation: {
        id: 'برو',
        tiempo_inicial: 'زمان شروع',
        tiempo_final: 'زمان پایانی',
        dia_semana_inicial: 'روز شروع هفته',
        dia_semana_final: 'روز هفته آخر',
        dia_mes_inicio: 'روز شروع ماه',
        dia_mes_final: 'روز پایان ماه',
        mes_inicio: 'ماه شروع',
        mes_final: 'ماه پایانی'
    }
};
