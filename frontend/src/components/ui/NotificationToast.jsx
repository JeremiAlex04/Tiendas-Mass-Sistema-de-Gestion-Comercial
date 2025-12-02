import React from 'react';
import useNotificationStore from '../../store/notificationStore';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

const NotificationToast = () => {
    const { notifications, removeNotification } = useNotificationStore();

    if (notifications.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'error': return <XCircle className="w-6 h-6 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
            default: return <Info className="w-6 h-6 text-blue-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200';
            case 'error': return 'bg-red-50 border-red-200';
            case 'warning': return 'bg-yellow-50 border-yellow-200';
            default: return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`flex items-center p-4 mb-2 w-80 max-w-xs rounded-lg shadow-lg border ${getBgColor(notification.type)} transition-all duration-300 ease-in-out transform translate-x-0`}
                    role="alert"
                >
                    <div className="inline-flex items-center justify-center flex-shrink-0">
                        {getIcon(notification.type)}
                    </div>
                    <div className="ml-3 text-sm font-normal text-gray-800 break-words flex-1">
                        {notification.message}
                    </div>
                    <button
                        type="button"
                        className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
                        onClick={() => removeNotification(notification.id)}
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationToast;
