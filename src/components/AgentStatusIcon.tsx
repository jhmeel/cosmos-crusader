import React from 'react';
import { CheckCircleOutlined, ClockCircleOutlined, CarOutlined, CloseCircleOutlined, SmileOutlined } from '@ant-design/icons';
import { DeliveryStatus } from '../types';



interface DeliveryStatusIconProps {
  status: DeliveryStatus;
}

const DeliveryStatusIcon: React.FC<DeliveryStatusIconProps> = ({ status }) => {
  const statusIconMap = {
    [DeliveryStatus.ASSIGNED]: (
      <CheckCircleOutlined style={{ color: 'blue' }} title={DeliveryStatus.ASSIGNED} />
    ),
    [DeliveryStatus.AVAILABLE]: (
      <ClockCircleOutlined style={{ color: 'green' }} title={DeliveryStatus.AVAILABLE} />
    ),
    [DeliveryStatus.IN_TRANSIT]: (
      <CarOutlined style={{ color: 'orange' }} title={DeliveryStatus.IN_TRANSIT} />
    ),
    [DeliveryStatus.UNAVAILABLE]: (
      <CloseCircleOutlined style={{ color: 'red' }} title={DeliveryStatus.UNAVAILABLE} />
    ),
    [DeliveryStatus.DELIVERED]: (
      <SmileOutlined style={{ color: 'purple' }} title={DeliveryStatus.DELIVERED} />
    ),
  };

  return <div>{statusIconMap[status] || <CloseCircleOutlined style={{ color: 'gray' }} />}</div>;
};

export default DeliveryStatusIcon;
