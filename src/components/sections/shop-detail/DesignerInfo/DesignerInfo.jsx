import designerImage from '../../../../assets/images/designer.png';
import { DesignerInfoContainer, DesignerImage, Detail, DesignerName, ReservationTime, Specialty } from './DesignerInfo.styles';

const DesignerInfo = ({ name, specialty, reservationTime }) => {
  return (
    <DesignerInfoContainer>
        <DesignerImage src={designerImage} alt='임시 디자이너 이미지' />
        <Detail>
            <DesignerName>{name}</DesignerName>
            <ReservationTime>{reservationTime}</ReservationTime>
            <Specialty>{specialty}</Specialty>
        </Detail>
    </DesignerInfoContainer>
  );
};

export default DesignerInfo; 