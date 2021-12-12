import useSWR from "swr";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";

import { OrderItemRow } from "../OrderItemRow";
import { MenuItem } from "../../db/DbTypes";
import { TabHeader } from "./TabHeader";

export function ItemsPanel() {
  const { data: items, error: itemsError } = useSWR<MenuItem[]>("/api/menu", url => fetch(url).then(r => r.json()));
  return (
    <Container>
      <TabHeader title="Items" button={<Button>Add</Button>} />
      <ListGroup>
        {items?.map((item, idx) => (
          <OrderItemRow key={idx} item={{ item, count: 1 }} />
        ))}
      </ListGroup>
    </Container>
  );
}

/*
function ItemEditModal() {
  const imgRef = useRef<HTMLImageElement>();
  const previewCanvasRef = useRef<HTMLCanvasElement>();
  const [upImg, setUpImg] = useState<string>();
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 30, aspect: 16 / 9 } as Crop);
  const [completedCrop, setCompletedCrop] = useState<Crop>();

  function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setUpImg(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img: HTMLImageElement) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx!.imageSmoothingQuality = 'high';

    ctx!.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="file" accept="image/*" onChange={onSelectFile} />
        <ReactCrop
          src={upImg!}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={c => setCrop(c)}
          onComplete={c => setCompletedCrop(c)}
          locked={true}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleClose}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
}
*/
