import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, CreditCard, Settings, LogIn, LogOut, Plus, Minus, Save, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const BookingWidget = () => {
  // Estados principales
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  // Configuración por defecto
  const [config, setConfig] = useState({
    weekDays: {
      monday: {
        enabled: true,
        hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      },
      tuesday: {
        enabled: true,
        hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      },
      wednesday: {
        enabled: true,
        hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      },
      thursday: {
        enabled: true,
        hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      },
      friday: {
        enabled: true,
        hours: ['09:00', '10:00', '11:00', '14:00', '15:00']
      },
      saturday: {
        enabled: false,
        hours: []
      },
      sunday: {
        enabled: false,
        hours: []
      }
    },
    dateRange: {
      startMonth: new Date().getMonth() + 1,
      startYear: new Date().getFullYear(),
      endMonth: 12,
      endYear: new Date().getFullYear()
    },
    prices: {
      consultation30: 45000,
      consultation60: 75000
    },
    blockedDates: []
  });

  // Estados del formulario de reserva
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientReason, setClientReason] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generar días del mes actual
  const generateMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];

    // Agregar días vacíos al inicio para alinear con el día de la semana
    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Agregar todos los días del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', {
        weekday: 'long'
      }).toLowerCase();
      const dayConfig = config.weekDays[dayName];
      const isPast = date < today;
      const isAvailable = dayConfig && dayConfig.enabled && !config.blockedDates.includes(dateStr) && !isPast;
      days.push({
        day,
        date: dateStr,
        fullDate: date,
        isAvailable,
        availableHours: isAvailable && dayConfig ? dayConfig.hours : []
      });
    }
    return days;
  };
  const monthDays = generateMonthDays();

  // Obtener horarios disponibles para el día seleccionado
  const getAvailableHours = () => {
    if (!selectedDate) return [];
    const selectedDay = monthDays.find(day => day && day.date === selectedDate);
    if (!selectedDay || !selectedDay.availableHours) return [];
    return selectedDay.availableHours.filter(hour => {
      return !reservations.some(r => r.date === selectedDate && r.time === hour);
    });
  };
  const availableHours = getAvailableHours();

  // Función de login
  const handleLogin = () => {
    if (adminPassword === 'anita2024') {
      setIsAdmin(true);
      setShowLogin(false);
      setAdminPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  // Función para actualizar horarios de un día
  const updateDayHours = (day, hours) => {
    setConfig(prev => ({
      ...prev,
      weekDays: {
        ...prev.weekDays,
        [day]: {
          ...prev.weekDays[day],
          hours
        }
      }
    }));
  };

  // Función para agregar/quitar hora
  const addHour = (day, hour) => {
    const currentHours = config.weekDays[day].hours;
    const newHours = [...currentHours, hour].sort();
    updateDayHours(day, newHours);
  };
  const removeHour = (day, hour) => {
    const currentHours = config.weekDays[day].hours;
    const newHours = currentHours.filter(h => h !== hour);
    updateDayHours(day, newHours);
  };

  // Función para procesar pago (simulado)
  const processPayment = () => {
    const reservation = {
      id: Date.now(),
      date: selectedDate,
      time: selectedTime,
      duration: selectedDuration,
      client: {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        reason: clientReason
      },
      price: selectedDuration === 30 ? config.prices.consultation30 : config.prices.consultation60,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    setReservations([...reservations, reservation]);
    alert('¡Reserva confirmada! Recibirás un email de confirmación.');

    // Reset form
    setCurrentStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDuration(30);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientReason('');
  };

  // Navegación del calendario
  const navigateMonth = direction => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
    setSelectedDate('');
    setSelectedTime('');
  };

  // Obtener nombre del día seleccionado
  const getSelectedDayName = () => {
    if (!selectedDate) return '';
    try {
      // Crear fecha agregando la zona horaria para evitar offset
      const [year, month, day] = selectedDate.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    } catch (error) {
      return '';
    }
  };

  // Componente separado para el formulario de datos
  const ClientDataForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [reason, setReason] = useState('');

    // Validaciones
    const isValidEmail = email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    const handlePhoneChange = e => {
      // Solo permitir números, espacios y guiones
      const value = e.target.value.replace(/[^0-9\s\-]/g, '');
      setPhone(value);
    };
    const handleSubmit = () => {
      setClientName(name);
      setClientEmail(email);
      setClientPhone(phone);
      setClientReason(reason);
      setCurrentStep(3);
    };
    const isValid = name && email && isValidEmail(email) && phone && phone.length >= 8;
    return /*#__PURE__*/_jsx("div", {
      className: "flex justify-center items-center min-h-screen p-4",
      children: /*#__PURE__*/_jsx("div", {
        className: "bg-white rounded-2xl shadow-lg border border-gray-200 w-full",
        style: {
          maxWidth: '700px',
          width: '100%'
        },
        children: /*#__PURE__*/_jsxs("div", {
          className: "p-6",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex justify-between items-start mb-6",
            children: [/*#__PURE__*/_jsx("h2", {
              className: "text-2xl font-bold",
              style: {
                color: '#173E4B'
              },
              children: "Completa tus datos"
            }), /*#__PURE__*/_jsxs("div", {
              className: "text-right",
              style: {
                color: '#173E4B'
              },
              children: [/*#__PURE__*/_jsx("div", {
                className: "font-semibold text-base",
                children: selectedDuration === 30 ? 'Consulta Breve' : 'Consulta Completa'
              }), /*#__PURE__*/_jsx("div", {
                className: "text-xs opacity-70 mt-1",
                children: selectedDate && selectedTime ? `${selectedDate} / ${selectedTime}` : 'Fecha no seleccionada'
              }), /*#__PURE__*/_jsxs("div", {
                className: "text-lg font-bold mt-1",
                children: ["$ ", (selectedDuration === 30 ? config.prices.consultation30 : config.prices.consultation60).toLocaleString('es-CL')]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-4",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium mb-2",
                style: {
                  color: '#173E4B'
                },
                children: "Nombre completo *"
              }), /*#__PURE__*/_jsx("input", {
                type: "text",
                value: name,
                onChange: e => setName(e.target.value),
                className: "w-full p-3 border-2 rounded-lg focus:outline-none",
                style: {
                  borderColor: '#173E4B'
                },
                required: true
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium mb-2",
                style: {
                  color: '#173E4B'
                },
                children: "Email *"
              }), /*#__PURE__*/_jsx("input", {
                type: "email",
                value: email,
                onChange: e => setEmail(e.target.value),
                className: `w-full p-3 border-2 rounded-lg focus:outline-none ${email && !isValidEmail(email) ? 'border-red-500' : ''}`,
                style: {
                  borderColor: email && !isValidEmail(email) ? '#ef4444' : '#173E4B'
                },
                placeholder: "ejemplo@correo.com",
                required: true
              }), email && !isValidEmail(email) && /*#__PURE__*/_jsx("p", {
                className: "text-red-500 text-xs mt-1",
                children: "Por favor ingresa un email v\xE1lido"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium mb-2",
                style: {
                  color: '#173E4B'
                },
                children: "Tel\xE9fono *"
              }), /*#__PURE__*/_jsx("input", {
                type: "tel",
                value: phone,
                onChange: handlePhoneChange,
                className: `w-full p-3 border-2 rounded-lg focus:outline-none ${phone && phone.length < 8 ? 'border-red-500' : ''}`,
                style: {
                  borderColor: phone && phone.length < 8 ? '#ef4444' : '#173E4B'
                },
                placeholder: "9 1234 5678",
                required: true
              }), phone && phone.length < 8 && /*#__PURE__*/_jsx("p", {
                className: "text-red-500 text-xs mt-1",
                children: "El tel\xE9fono debe tener al menos 8 d\xEDgitos"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium mb-2",
                style: {
                  color: '#173E4B'
                },
                children: "Motivo de consulta"
              }), /*#__PURE__*/_jsx("textarea", {
                value: reason,
                onChange: e => setReason(e.target.value),
                className: "w-full p-3 border-2 rounded-lg h-24 focus:outline-none resize-none",
                style: {
                  borderColor: '#173E4B'
                },
                placeholder: "Describe brevemente el motivo de tu consulta..."
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-4 mt-6",
            children: [/*#__PURE__*/_jsx("button", {
              onClick: () => setCurrentStep(1),
              className: "flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold",
              children: "Volver"
            }), /*#__PURE__*/_jsx("button", {
              onClick: handleSubmit,
              disabled: !isValid,
              className: "flex-1 py-3 rounded-lg transition-colors disabled:bg-gray-300 text-white font-semibold",
              style: {
                backgroundColor: !isValid ? '#ccc' : '#173E4B'
              },
              children: "Proceder al pago"
            })]
          })]
        })
      })
    });
  };

  // Componente de administración
  const AdminPanel = () => /*#__PURE__*/_jsxs("div", {
    className: "space-y-6 p-6",
    style: {
      backgroundColor: '#F0F1EC',
      minHeight: '100vh'
    },
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex justify-between items-center",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "text-2xl font-bold",
        style: {
          color: '#173E4B'
        },
        children: "Panel de Administraci\xF3n"
      }), /*#__PURE__*/_jsxs("button", {
        onClick: () => setIsAdmin(false),
        className: "flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90",
        style: {
          backgroundColor: '#173E4B'
        },
        children: [/*#__PURE__*/_jsx(LogOut, {
          size: 16
        }), "Cerrar Sesi\xF3n"]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid lg:grid-cols-2 gap-6",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "bg-white p-6 rounded-lg shadow-sm border border-gray-200",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "text-lg font-semibold mb-4",
          style: {
            color: '#173E4B'
          },
          children: "Horarios por D\xEDa"
        }), Object.entries(config.weekDays).map(([day, dayConfig]) => /*#__PURE__*/_jsxs("div", {
          className: "mb-4 p-4 border rounded-lg border-gray-200",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex items-center justify-between mb-2",
            children: /*#__PURE__*/_jsxs("label", {
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsx("input", {
                type: "checkbox",
                checked: dayConfig.enabled,
                onChange: e => setConfig(prev => ({
                  ...prev,
                  weekDays: {
                    ...prev.weekDays,
                    [day]: {
                      ...dayConfig,
                      enabled: e.target.checked
                    }
                  }
                })),
                style: {
                  accentColor: '#173E4B'
                }
              }), /*#__PURE__*/_jsx("span", {
                className: "font-medium capitalize",
                style: {
                  color: '#173E4B'
                },
                children: day === 'monday' ? 'Lunes' : day === 'tuesday' ? 'Martes' : day === 'wednesday' ? 'Miércoles' : day === 'thursday' ? 'Jueves' : day === 'friday' ? 'Viernes' : day === 'saturday' ? 'Sábado' : 'Domingo'
              })]
            })
          }), dayConfig.enabled && /*#__PURE__*/_jsxs("div", {
            className: "space-y-2",
            children: [/*#__PURE__*/_jsx("div", {
              className: "flex flex-wrap gap-1",
              children: dayConfig.hours.map(hour => /*#__PURE__*/_jsxs("span", {
                className: "inline-flex items-center gap-1 px-2 py-1 text-white text-sm rounded",
                style: {
                  backgroundColor: '#173E4B'
                },
                children: [hour, /*#__PURE__*/_jsx("button", {
                  onClick: () => removeHour(day, hour),
                  className: "text-red-300 hover:text-red-100",
                  children: /*#__PURE__*/_jsx(Minus, {
                    size: 12
                  })
                })]
              }, hour))
            }), /*#__PURE__*/_jsxs("select", {
              onChange: e => {
                if (e.target.value && !dayConfig.hours.includes(e.target.value)) {
                  addHour(day, e.target.value);
                }
                e.target.value = '';
              },
              className: "w-full p-2 border rounded text-sm border-gray-300 focus:outline-none",
              style: {
                borderColor: '#173E4B'
              },
              children: [/*#__PURE__*/_jsx("option", {
                value: "",
                children: "Agregar hora..."
              }), Array.from({
                length: 12
              }, (_, i) => {
                const hour = String(8 + i).padStart(2, '0') + ':00';
                return /*#__PURE__*/_jsx("option", {
                  value: hour,
                  children: hour
                }, hour);
              })]
            })]
          })]
        }, day))]
      }), /*#__PURE__*/_jsx("div", {
        className: "space-y-6",
        children: /*#__PURE__*/_jsxs("div", {
          className: "bg-white p-6 rounded-lg shadow-sm border border-gray-200",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-lg font-semibold mb-4",
            style: {
              color: '#173E4B'
            },
            children: "Precios"
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-4",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium mb-1",
                style: {
                  color: '#173E4B'
                },
                children: "Consulta 30 min (CLP)"
              }), /*#__PURE__*/_jsx("input", {
                type: "number",
                value: config.prices.consultation30,
                onChange: e => setConfig(prev => ({
                  ...prev,
                  prices: {
                    ...prev.prices,
                    consultation30: parseInt(e.target.value)
                  }
                })),
                className: "w-full p-2 border rounded border-gray-300 focus:outline-none",
                style: {
                  borderColor: '#173E4B'
                }
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("label", {
                className: "block text-sm font-medium mb-1",
                style: {
                  color: '#173E4B'
                },
                children: "Consulta 60 min (CLP)"
              }), /*#__PURE__*/_jsx("input", {
                type: "number",
                value: config.prices.consultation60,
                onChange: e => setConfig(prev => ({
                  ...prev,
                  prices: {
                    ...prev.prices,
                    consultation60: parseInt(e.target.value)
                  }
                })),
                className: "w-full p-2 border rounded border-gray-300 focus:outline-none",
                style: {
                  borderColor: '#173E4B'
                }
              })]
            })]
          })]
        })
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "bg-white p-6 rounded-lg shadow-sm border border-gray-200",
      children: [/*#__PURE__*/_jsxs("h3", {
        className: "text-lg font-semibold mb-4",
        style: {
          color: '#173E4B'
        },
        children: ["Reservas Confirmadas (", reservations.length, ")"]
      }), reservations.length === 0 ? /*#__PURE__*/_jsx("p", {
        className: "text-gray-500",
        children: "No hay reservas a\xFAn."
      }) : /*#__PURE__*/_jsx("div", {
        className: "overflow-x-auto",
        children: /*#__PURE__*/_jsxs("table", {
          className: "w-full text-sm",
          children: [/*#__PURE__*/_jsx("thead", {
            children: /*#__PURE__*/_jsxs("tr", {
              className: "border-b border-gray-200",
              children: [/*#__PURE__*/_jsx("th", {
                className: "text-left p-2",
                style: {
                  color: '#173E4B'
                },
                children: "Fecha"
              }), /*#__PURE__*/_jsx("th", {
                className: "text-left p-2",
                style: {
                  color: '#173E4B'
                },
                children: "Hora"
              }), /*#__PURE__*/_jsx("th", {
                className: "text-left p-2",
                style: {
                  color: '#173E4B'
                },
                children: "Cliente"
              }), /*#__PURE__*/_jsx("th", {
                className: "text-left p-2",
                style: {
                  color: '#173E4B'
                },
                children: "Duraci\xF3n"
              }), /*#__PURE__*/_jsx("th", {
                className: "text-left p-2",
                style: {
                  color: '#173E4B'
                },
                children: "Precio"
              })]
            })
          }), /*#__PURE__*/_jsx("tbody", {
            children: reservations.map(reservation => /*#__PURE__*/_jsxs("tr", {
              className: "border-b border-gray-100",
              children: [/*#__PURE__*/_jsx("td", {
                className: "p-2",
                children: new Date(reservation.date).toLocaleDateString('es-CL')
              }), /*#__PURE__*/_jsx("td", {
                className: "p-2",
                children: reservation.time
              }), /*#__PURE__*/_jsx("td", {
                className: "p-2",
                children: reservation.client.name
              }), /*#__PURE__*/_jsxs("td", {
                className: "p-2",
                children: [reservation.duration, " min"]
              }), /*#__PURE__*/_jsxs("td", {
                className: "p-2",
                children: ["$", reservation.price.toLocaleString('es-CL')]
              })]
            }, reservation.id))
          })]
        })
      })]
    })]
  });

  // Componente público de reservas
  const PublicBooking = () => /*#__PURE__*/_jsx("div", {
    style: {
      backgroundColor: '#F0F1EC',
      height: '970px',
      maxWidth: '1600px',
      margin: '0 auto'
    },
    children: /*#__PURE__*/_jsxs("div", {
      className: "p-8 h-full",
      children: [/*#__PURE__*/_jsx("div", {
        className: "text-left mb-6",
        children: /*#__PURE__*/_jsx("h1", {
          className: "text-3xl font-bold",
          style: {
            color: '#173E4B'
          },
          children: "Agenda una consulta"
        })
      }), currentStep === 1 && /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-12 gap-6 h-full max-h-[800px]",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "col-span-3 space-y-4",
          children: [/*#__PURE__*/_jsx("div", {
            style: {
              color: '#173E4B'
            },
            children: /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3 mb-4",
              children: [/*#__PURE__*/_jsx("div", {
                className: "text-2xl",
                children: "\u273B"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("div", {
                  className: "text-lg font-bold",
                  children: "ANITA L\xC9NIZ"
                }), /*#__PURE__*/_jsx("div", {
                  className: "text-xs opacity-70",
                  children: "ASESOR\xCDA EN SALUD"
                })]
              })]
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "flex justify-start mb-4",
            children: /*#__PURE__*/_jsx("div", {
              className: "w-16 h-16 rounded-full overflow-hidden",
              style: {
                backgroundColor: '#173E4B'
              },
              children: /*#__PURE__*/_jsx("div", {
                className: "w-full h-full flex items-center justify-center text-white text-lg font-bold",
                children: "AL"
              })
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-3",
            children: [/*#__PURE__*/_jsxs("button", {
              onClick: () => setSelectedDuration(30),
              className: `w-full p-3 rounded-lg border-2 transition-all text-left ${selectedDuration === 30 ? 'text-white' : 'border-gray-200 hover:border-gray-300 bg-white'}`,
              style: selectedDuration === 30 ? {
                backgroundColor: '#173E4B',
                borderColor: '#173E4B'
              } : {
                color: '#173E4B'
              },
              children: [/*#__PURE__*/_jsx("div", {
                className: "font-bold text-sm mb-1",
                children: "Consulta Breve"
              }), /*#__PURE__*/_jsxs("div", {
                className: "text-lg font-bold mb-1",
                children: ["$ ", config.prices.consultation30.toLocaleString('es-CL')]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 text-xs opacity-80",
                children: [/*#__PURE__*/_jsx(Clock, {
                  size: 12
                }), /*#__PURE__*/_jsx("span", {
                  children: "30 min"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 text-xs opacity-80",
                children: [/*#__PURE__*/_jsx(User, {
                  size: 12
                }), /*#__PURE__*/_jsx("span", {
                  children: "Zoom"
                })]
              })]
            }), /*#__PURE__*/_jsxs("button", {
              onClick: () => setSelectedDuration(60),
              className: `w-full p-3 rounded-lg border-2 transition-all text-left ${selectedDuration === 60 ? 'text-white' : 'border-gray-200 hover:border-gray-300 bg-white'}`,
              style: selectedDuration === 60 ? {
                backgroundColor: '#173E4B',
                borderColor: '#173E4B'
              } : {
                color: '#173E4B'
              },
              children: [/*#__PURE__*/_jsx("div", {
                className: "font-bold text-sm mb-1",
                children: "Consulta Completa"
              }), /*#__PURE__*/_jsxs("div", {
                className: "text-lg font-bold mb-1",
                children: ["$ ", config.prices.consultation60.toLocaleString('es-CL')]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 text-xs opacity-80",
                children: [/*#__PURE__*/_jsx(Clock, {
                  size: 12
                }), /*#__PURE__*/_jsx("span", {
                  children: "60 min"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 text-xs opacity-80",
                children: [/*#__PURE__*/_jsx(User, {
                  size: 12
                }), /*#__PURE__*/_jsx("span", {
                  children: "Zoom"
                })]
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "col-span-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-base font-semibold mb-4 text-center",
            style: {
              color: '#173E4B'
            },
            children: "Selecciona una Fecha y Hora"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-4",
            children: [/*#__PURE__*/_jsx("button", {
              onClick: () => navigateMonth(-1),
              className: "p-1 hover:bg-gray-100 rounded transition-colors",
              children: /*#__PURE__*/_jsx(ChevronLeft, {
                size: 16,
                style: {
                  color: '#173E4B'
                }
              })
            }), /*#__PURE__*/_jsx("span", {
              className: "font-semibold text-center text-sm",
              style: {
                color: '#173E4B'
              },
              children: currentMonth.toLocaleDateString('es-CL', {
                month: 'long',
                year: 'numeric'
              })
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => navigateMonth(1),
              className: "p-1 hover:bg-gray-100 rounded transition-colors",
              children: /*#__PURE__*/_jsx(ChevronRight, {
                size: 16,
                style: {
                  color: '#173E4B'
                }
              })
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-7 gap-1 mb-2",
            children: ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(day => /*#__PURE__*/_jsx("div", {
              className: "text-center text-xs font-medium py-1 opacity-60",
              style: {
                color: '#173E4B'
              },
              children: day
            }, day))
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-7 gap-1 mb-4",
            children: monthDays.map((day, index) => /*#__PURE__*/_jsx("button", {
              disabled: !day || !(day !== null && day !== void 0 && day.isAvailable),
              onClick: () => day && day.isAvailable && setSelectedDate(day.date),
              className: `w-8 h-8 flex items-center justify-center text-xs rounded-full transition-all font-medium ${!day ? 'invisible' : selectedDate === (day === null || day === void 0 ? void 0 : day.date) ? 'text-white font-bold' : day !== null && day !== void 0 && day.isAvailable ? 'text-gray-800 hover:bg-gray-100 font-semibold' : 'text-gray-300 cursor-not-allowed font-normal'}`,
              style: selectedDate === (day === null || day === void 0 ? void 0 : day.date) ? {
                backgroundColor: '#173E4B'
              } : {},
              children: day && day.day
            }, index))
          }), /*#__PURE__*/_jsxs("div", {
            className: "pt-3 border-t border-gray-200",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 text-xs",
              style: {
                color: '#173E4B'
              },
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-3 h-3 rounded-full border",
                style: {
                  borderColor: '#173E4B'
                },
                children: /*#__PURE__*/_jsx("div", {
                  className: "w-1 h-1 rounded-full mx-auto mt-0.5",
                  style: {
                    backgroundColor: '#173E4B'
                  }
                })
              }), /*#__PURE__*/_jsx("span", {
                children: "Zona horaria"
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "text-xs mt-1 opacity-70 ml-5",
              style: {
                color: '#173E4B'
              },
              children: "Hora de Chile - Am\xE9rica/Santiago \u25BC"
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "col-span-3 space-y-3",
          children: selectedDate ? /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-sm font-semibold",
              style: {
                color: '#173E4B'
              },
              children: getSelectedDayName()
            }), /*#__PURE__*/_jsx("div", {
              className: "space-y-2 max-h-80 overflow-y-auto",
              children: availableHours.length === 0 ? /*#__PURE__*/_jsx("p", {
                className: "text-center py-4 opacity-60 text-xs",
                style: {
                  color: '#173E4B'
                },
                children: "No hay horarios disponibles"
              }) : availableHours.map(hour => /*#__PURE__*/_jsx("button", {
                onClick: () => setSelectedTime(hour),
                className: `w-full p-2 rounded-lg text-center transition-all border font-medium text-sm ${selectedTime === hour ? 'text-white' : 'bg-white hover:border-gray-300'}`,
                style: selectedTime === hour ? {
                  backgroundColor: '#173E4B',
                  borderColor: '#173E4B'
                } : {
                  color: '#173E4B',
                  borderColor: '#4A90E2'
                },
                children: hour
              }, hour))
            }), selectedTime && /*#__PURE__*/_jsx("button", {
              onClick: () => setCurrentStep(2),
              className: "w-full py-2 rounded-lg font-semibold text-white transition-colors text-sm",
              style: {
                backgroundColor: '#173E4B'
              },
              children: "Confirmar"
            })]
          }) : /*#__PURE__*/_jsxs("div", {
            className: "text-center py-6 opacity-60",
            style: {
              color: '#173E4B'
            },
            children: [/*#__PURE__*/_jsx(Calendar, {
              size: 24,
              className: "mx-auto mb-2"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs",
              children: "Selecciona una fecha"
            })]
          })
        })]
      }), currentStep === 2 && /*#__PURE__*/_jsx(ClientDataForm, {}), currentStep === 3 && /*#__PURE__*/_jsx("div", {
        className: "max-w-2xl mx-auto",
        children: /*#__PURE__*/_jsxs("div", {
          className: "bg-white p-8 rounded-2xl shadow-sm border border-gray-200",
          children: [/*#__PURE__*/_jsxs("h2", {
            className: "text-2xl font-bold mb-6 flex items-center gap-2",
            style: {
              color: '#173E4B'
            },
            children: [/*#__PURE__*/_jsx(CreditCard, {
              size: 24
            }), "Confirmar y pagar"]
          }), /*#__PURE__*/_jsxs("div", {
            className: "p-6 rounded-xl mb-6",
            style: {
              backgroundColor: '#F0F1EC'
            },
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-semibold mb-4",
              style: {
                color: '#173E4B'
              },
              children: "Resumen de tu reserva:"
            }), /*#__PURE__*/_jsxs("div", {
              className: "space-y-2 text-sm",
              style: {
                color: '#173E4B'
              },
              children: [/*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("strong", {
                  children: "Fecha:"
                }), " ", selectedDate ? (() => {
                  const [year, month, day] = selectedDate.split('-');
                  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                  return date.toLocaleDateString('es-CL');
                })() : 'No seleccionada']
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("strong", {
                  children: "Hora:"
                }), " ", selectedTime || 'No seleccionada']
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("strong", {
                  children: "Duraci\xF3n:"
                }), " ", selectedDuration, " minutos"]
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("strong", {
                  children: "Cliente:"
                }), " ", clientName]
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("strong", {
                  children: "Email:"
                }), " ", clientEmail]
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("strong", {
                  children: "Tel\xE9fono:"
                }), " ", clientPhone]
              }), clientReason && /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("strong", {
                  children: "Motivo:"
                }), " ", clientReason]
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "border-t pt-3 mt-3",
              style: {
                borderColor: '#173E4B'
              },
              children: /*#__PURE__*/_jsxs("div", {
                className: "text-2xl font-bold",
                style: {
                  color: '#173E4B'
                },
                children: ["Total: $", (selectedDuration === 30 ? config.prices.consultation30 : config.prices.consultation60).toLocaleString('es-CL')]
              })
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "bg-blue-50 p-6 rounded-xl mb-6 border border-blue-200",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3 mb-4",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-12 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold",
                children: "MP"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("div", {
                  className: "font-semibold",
                  style: {
                    color: '#173E4B'
                  },
                  children: "Pago con MercadoPago"
                }), /*#__PURE__*/_jsx("div", {
                  className: "text-sm opacity-70",
                  style: {
                    color: '#173E4B'
                  },
                  children: "Tarjetas de cr\xE9dito y d\xE9bito \u2022 Pagos en cuotas disponibles"
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "text-sm opacity-80",
              style: {
                color: '#173E4B'
              },
              children: [/*#__PURE__*/_jsx("div", {
                children: "\u2022 Pago seguro y protegido"
              }), /*#__PURE__*/_jsx("div", {
                children: "\u2022 Cuotas sin inter\xE9s disponibles con tarjetas de cr\xE9dito"
              }), /*#__PURE__*/_jsx("div", {
                children: "\u2022 Confirmaci\xF3n inmediata por email"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-4",
            children: [/*#__PURE__*/_jsx("button", {
              onClick: () => setCurrentStep(2),
              className: "flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors",
              children: "Volver"
            }), /*#__PURE__*/_jsx("button", {
              onClick: processPayment,
              className: "flex-1 py-3 rounded-lg transition-colors font-semibold text-white",
              style: {
                backgroundColor: '#173E4B'
              },
              children: "Pagar y Confirmar Reserva"
            })]
          })]
        })
      })]
    })
  });
  return /*#__PURE__*/_jsxs("div", {
    className: "relative",
    children: [!isAdmin && /*#__PURE__*/_jsx("div", {
      className: "fixed top-4 right-4 z-50",
      children: /*#__PURE__*/_jsxs("button", {
        onClick: () => setShowLogin(true),
        className: "flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-70 text-sm transition-opacity",
        style: {
          backgroundColor: '#F0F1EC',
          color: '#173E4B'
        },
        children: [/*#__PURE__*/_jsx(Settings, {
          size: 16
        }), "Admin"]
      })
    }), showLogin && /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
      children: /*#__PURE__*/_jsxs("div", {
        className: "bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "text-lg font-semibold mb-4",
          style: {
            color: '#173E4B'
          },
          children: "Acceso Administrativo"
        }), /*#__PURE__*/_jsx("input", {
          type: "password",
          placeholder: "Contrase\xF1a",
          value: adminPassword,
          onChange: e => setAdminPassword(e.target.value),
          className: "w-full p-3 border rounded-lg mb-4 border-gray-300 focus:outline-none",
          style: {
            borderColor: '#173E4B'
          },
          onKeyPress: e => e.key === 'Enter' && handleLogin()
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-2",
          children: [/*#__PURE__*/_jsx("button", {
            onClick: () => setShowLogin(false),
            className: "flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300",
            children: "Cancelar"
          }), /*#__PURE__*/_jsx("button", {
            onClick: handleLogin,
            className: "flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90",
            style: {
              backgroundColor: '#173E4B'
            },
            children: "Ingresar"
          })]
        })]
      })
    }), isAdmin ? /*#__PURE__*/_jsx(AdminPanel, {}) : /*#__PURE__*/_jsx(PublicBooking, {})]
  });
};
export default BookingWidget; 
