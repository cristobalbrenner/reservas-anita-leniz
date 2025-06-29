const { useState } = React;

// Iconos simples sin librerías externas
const CalendarIcon = () => React.createElement('div', {style: {fontSize: '20px'}}, '📅');
const ClockIcon = () => React.createElement('div', {style: {fontSize: '16px'}}, '🕐');
const UserIcon = () => React.createElement('div', {style: {fontSize: '16px'}}, '👤');
const SettingsIcon = () => React.createElement('div', {style: {fontSize: '16px'}}, '⚙️');
const ChevronLeft = () => React.createElement('div', {style: {fontSize: '16px'}}, '‹');
const ChevronRight = () => React.createElement('div', {style: {fontSize: '16px'}}, '›');

const BookingWidget = () => {
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const config = {
    weekDays: {
      monday: { enabled: true, hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
      tuesday: { enabled: true, hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
      wednesday: { enabled: true, hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
      thursday: { enabled: true, hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
      friday: { enabled: true, hours: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      saturday: { enabled: false, hours: [] },
      sunday: { enabled: false, hours: [] }
    },
    prices: {
      consultation30: 45000,
      consultation60: 75000
    }
  };

  const generateMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days = [];
    const startDay = firstDay.getDay();
    
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const dayConfig = config.weekDays[dayName];
      
      const isPast = date < today;
      const isAvailable = dayConfig && dayConfig.enabled && !isPast;
      
      days.push({
        day,
        date: dateStr,
        isAvailable,
        availableHours: isAvailable && dayConfig ? dayConfig.hours : []
      });
    }
    
    return days;
  };

  const monthDays = generateMonthDays();

  const getAvailableHours = () => {
    if (!selectedDate) return [];
    const selectedDay = monthDays.find(day => day && day.date === selectedDate);
    return selectedDay ? selectedDay.availableHours : [];
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleLogin = () => {
    if (adminPassword === 'anita2024') {
      setIsAdmin(true);
      setShowLogin(false);
      setAdminPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  if (currentStep === 2) {
    return React.createElement('div', {
      style: { 
        backgroundColor: '#F0F1EC', 
        minHeight: '100vh', 
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    },
      React.createElement('div', {
        style: {
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%'
        }
      },
        React.createElement('h2', {
          style: { color: '#173E4B', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }
        }, 'Completa tus datos'),
        React.createElement('div', { style: { marginBottom: '20px' } },
          React.createElement('label', {
            style: { display: 'block', color: '#173E4B', fontWeight: '600', marginBottom: '8px' }
          }, 'Nombre completo *'),
          React.createElement('input', {
            type: 'text',
            style: {
              width: '100%',
              padding: '12px',
              border: '2px solid #173E4B',
              borderRadius: '8px',
              fontSize: '16px'
            },
            placeholder: 'Tu nombre completo'
          })
        ),
        React.createElement('div', { style: { marginBottom: '20px' } },
          React.createElement('label', {
            style: { display: 'block', color: '#173E4B', fontWeight: '600', marginBottom: '8px' }
          }, 'Email *'),
          React.createElement('input', {
            type: 'email',
            style: {
              width: '100%',
              padding: '12px',
              border: '2px solid #173E4B',
              borderRadius: '8px',
              fontSize: '16px'
            },
            placeholder: 'tu@email.com'
          })
        ),
        React.createElement('div', { style: { marginBottom: '20px' } },
          React.createElement('label', {
            style: { display: 'block', color: '#173E4B', fontWeight: '600', marginBottom: '8px' }
          }, 'Teléfono *'),
          React.createElement('input', {
            type: 'tel',
            style: {
              width: '100%',
              padding: '12px',
              border: '2px solid #173E4B',
              borderRadius: '8px',
              fontSize: '16px'
            },
            placeholder: '9 1234 5678'
          })
        ),
        React.createElement('div', { style: { display: 'flex', gap: '15px', marginTop: '30px' } },
          React.createElement('button', {
            onClick: () => setCurrentStep(1),
            style: {
              flex: 1,
              padding: '12px',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }
          }, 'Volver'),
          React.createElement('button', {
            onClick: () => alert('¡Pronto integraremos MercadoPago! Por ahora es una demo.'),
            style: {
              flex: 1,
              padding: '12px',
              backgroundColor: '#173E4B',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }
          }, 'Proceder al pago')
        )
      )
    );
  }

  return React.createElement('div', {
    style: { 
      backgroundColor: '#F0F1EC', 
      minHeight: '100vh', 
      padding: '20px'
    }
  },
    // Botón Admin
    !isAdmin && React.createElement('div', {
      style: { position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }
    },
      React.createElement('button', {
        onClick: () => setShowLogin(true),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 15px',
          backgroundColor: '#F0F1EC',
          color: '#173E4B',
          border: '1px solid #173E4B',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px'
        }
      },
        React.createElement(SettingsIcon),
        'Admin'
      )
    ),

    // Modal de login
    showLogin && React.createElement('div', {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1001
      }
    },
      React.createElement('div', {
        style: {
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '15px',
          maxWidth: '400px',
          width: '100%',
          margin: '20px'
        }
      },
        React.createElement('h3', {
          style: { color: '#173E4B', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }
        }, 'Acceso Administrativo'),
        React.createElement('input', {
          type: 'password',
          placeholder: 'Contraseña',
          value: adminPassword,
          onChange: (e) => setAdminPassword(e.target.value),
          style: {
            width: '100%',
            padding: '12px',
            border: '2px solid #173E4B',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '16px'
          }
        }),
        React.createElement('div', { style: { display: 'flex', gap: '10px' } },
          React.createElement('button', {
            onClick: () => setShowLogin(false),
            style: {
              flex: 1,
              padding: '10px',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }
          }, 'Cancelar'),
          React.createElement('button', {
            onClick: handleLogin,
            style: {
              flex: 1,
              padding: '10px',
              backgroundColor: '#173E4B',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }
          }, 'Ingresar')
        )
      )
    ),

    // Contenido principal
    React.createElement('div', {
      style: { maxWidth: '1200px', margin: '0 auto' }
    },
      React.createElement('h1', {
        style: { 
          color: '#173E4B', 
          fontSize: '32px', 
          fontWeight: 'bold', 
          marginBottom: '30px',
          textAlign: 'center'
        }
      }, 'Agenda una consulta'),

      React.createElement('div', {
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px',
          marginBottom: '30px'
        }
      },
        // Panel izquierdo - Información y precios
        React.createElement('div', {
          style: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }
        },
          React.createElement('div', {
            style: { color: '#173E4B', marginBottom: '20px' }
          },
            React.createElement('div', {
              style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }
            },
              React.createElement('div', { style: { fontSize: '24px' } }, '✻'),
              React.createElement('div', null,
                React.createElement('div', { style: { fontSize: '18px', fontWeight: 'bold' } }, 'ANITA LÉNIZ'),
                React.createElement('div', { style: { fontSize: '12px', opacity: 0.7 } }, 'ASESORÍA EN SALUD')
              )
            ),
            React.createElement('div', {
              style: {
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#173E4B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px'
              }
            }, 'AL')
          ),

          // Opciones de consulta
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
            React.createElement('button', {
              onClick: () => setSelectedDuration(30),
              style: {
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid',
                borderColor: selectedDuration === 30 ? '#173E4B' : '#e5e7eb',
                backgroundColor: selectedDuration === 30 ? '#173E4B' : 'white',
                color: selectedDuration === 30 ? 'white' : '#173E4B',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }
            },
              React.createElement('div', { style: { fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' } }, 'Consulta Breve'),
              React.createElement('div', { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' } },
                `$ ${config.prices.consultation30.toLocaleString('es-CL')}`
              ),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', opacity: 0.8 } },
                React.createElement(ClockIcon),
                React.createElement('span', null, '30 min')
              ),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', opacity: 0.8 } },
                React.createElement(UserIcon),
                React.createElement('span', null, 'Zoom')
              )
            ),

            React.createElement('button', {
              onClick: () => setSelectedDuration(60),
              style: {
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid',
                borderColor: selectedDuration === 60 ? '#173E4B' : '#e5e7eb',
                backgroundColor: selectedDuration === 60 ? '#173E4B' : 'white',
                color: selectedDuration === 60 ? 'white' : '#173E4B',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }
            },
              React.createElement('div', { style: { fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' } }, 'Consulta Completa'),
              React.createElement('div', { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' } },
                `$ ${config.prices.consultation60.toLocaleString('es-CL')}`
              ),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', opacity: 0.8 } },
                React.createElement(ClockIcon),
                React.createElement('span', null, '60 min')
              ),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', opacity: 0.8 } },
                React.createElement(UserIcon),
                React.createElement('span', null, 'Zoom')
              )
            )
          )
        ),

        // Panel central - Calendario
        React.createElement('div', {
          style: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }
        },
          React.createElement('h3', {
            style: { color: '#173E4B', fontSize: '16px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }
          }, 'Selecciona una Fecha y Hora'),

          React.createElement('div', {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }
          },
            React.createElement('button', {
              onClick: () => navigateMonth(-1),
              style: {
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderRadius: '5px'
              }
            }, React.createElement(ChevronLeft)),
            React.createElement('span', {
              style: { color: '#173E4B', fontWeight: '600', fontSize: '14px' }
            }, currentMonth.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })),
            React.createElement('button', {
              onClick: () => navigateMonth(1),
              style: {
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderRadius: '5px'
              }
            }, React.createElement(ChevronRight))
          ),

          React.createElement('div', {
            style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginBottom: '10px' }
          },
            ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(day =>
              React.createElement('div', {
                key: day,
                style: { textAlign: 'center', fontSize: '12px', fontWeight: '500', padding: '5px', color: '#173E4B', opacity: 0.6 }
              }, day)
            )
          ),

          React.createElement('div', {
            style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginBottom: '20px' }
          },
            monthDays.map((day, index) =>
              React.createElement('button', {
                key: index,
                disabled: !day || !day.isAvailable,
                onClick: () => day && day.isAvailable && setSelectedDate(day.date),
                style: {
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: day && day.isAvailable ? 'pointer' : 'not-allowed',
                  backgroundColor: !day ? 'transparent' :
                                   selectedDate === day.date ? '#173E4B' :
                                   day.isAvailable ? 'transparent' : 'transparent',
                  color: !day ? 'transparent' :
                         selectedDate === day.date ? 'white' :
                         day.isAvailable ? '#374151' : '#d1d5db',
                  fontWeight: selectedDate === day?.date ? 'bold' : day?.isAvailable ? '600' : 'normal'
                }
              }, day && day.day)
            )
          ),

          React.createElement('div', {
            style: { color: '#173E4B', fontSize: '12px', opacity: 0.7 }
          }, '🕐 Zona horaria: Chile - América/Santiago')
        ),

        // Panel derecho - Horarios
        React.createElement('div', {
          style: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }
        },
          selectedDate ? [
            React.createElement('div', {
              key: 'date-display',
              style: { color: '#173E4B', fontSize: '14px', fontWeight: '600', marginBottom: '15px' }
            }, selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CL', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            }) : ''),

            React.createElement('div', {
              key: 'hours',
              style: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }
            },
              getAvailableHours().length === 0 ?
                React.createElement('p', {
                  style: { textAlign: 'center', padding: '20px', color: '#173E4B', opacity: 0.6, fontSize: '12px' }
                }, 'No hay horarios disponibles') :
                getAvailableHours().map(hour =>
                  React.createElement('button', {
                    key: hour,
                    onClick: () => setSelectedTime(hour),
                    style: {
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #4A90E2',
                      backgroundColor: selectedTime === hour ? '#173E4B' : 'white',
                      color: selectedTime === hour ? 'white' : '#173E4B',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      textAlign: 'center'
                    }
                  }, hour)
                )
            ),

            selectedTime && React.createElement('button', {
              key: 'confirm',
              onClick: () => setCurrentStep(2),
              style: {
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#173E4B',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }
            }, 'Confirmar')
          ] : React.createElement('div', {
            style: { textAlign: 'center', padding: '40px', color: '#173E4B', opacity: 0.6 }
          },
            React.createElement(CalendarIcon),
            React.createElement('p', { style: { fontSize: '12px', marginTop: '10px' } }, 'Selecciona una fecha')
          )
        )
      )
    )
  );
};

ReactDOM.render(React.createElement(BookingWidget), document.getElementById('root'));
