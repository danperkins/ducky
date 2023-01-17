import * as React from "react";
import {
  IconButton,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  useDisclosure,
  IconButtonProps,
  FormLabel,
  Text,
  theme,
  InputProps,
} from "@chakra-ui/react";

// Taken from 'react-feather'
const Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-file-plus"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="18" x2="12" y2="12"></line>
    <line x1="9" y1="15" x2="15" y2="15"></line>
  </svg>
);

type AddFileButtonProps = {
  onAddFile: (label: string, file: File) => Promise<void>;
  labelPlaceholder: string;
  submitText: string;
  fileInputProps?: Partial<InputProps>;
} & Partial<IconButtonProps>;

/**
 * This component renders a button that toggles a Modal allowing users
 * to pick a file from their machine. The 'onAddFile' callback will be
 * invoked with the File object and the label specified by the user
 */
export const AddFileButton = ({
  onAddFile,
  labelPlaceholder,
  submitText,
  fileInputProps,
  ...iconButtonProps
}: AddFileButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [label, setLabel] = React.useState("");
  const [file, setFile] = React.useState<File | undefined>();

  // Reset 'label' and 'file' when the component opens
  React.useEffect(() => {
    if (isOpen) {
      setLabel("");
      setFile(undefined);
    }
  }, [isOpen]);

  const addFile = () => {
    if (label && file) {
      onAddFile(label, file).finally(onClose);
    }
  };
  return (
    <>
      <IconButton
        aria-label="Add File"
        icon={<Icon />}
        {...iconButtonProps}
        onClick={onOpen}
      ></IconButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={8}>
          <ModalHeader textAlign="center">{submitText}</ModalHeader>

          <Input
            type="text"
            placeholder={labelPlaceholder}
            onChange={(e) => setLabel(e.target.value)}
          ></Input>
          <Input
            opacity={0}
            id="file-upload"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0])}
            {...fileInputProps}
          ></Input>

          {file && <Text>File: {file.name}</Text>}
          {
            // Style the FormLabel like a button.
            // The 'htmlFor' attribute will trigger the hidden file input
          }
          <FormLabel
            htmlFor="file-upload"
            m={0}
            p={2}
            textAlign="center"
            backgroundColor={theme.colors.yellow[300]}
            cursor="pointer"
            borderRadius={theme.radii.md}
          >
            Choose File
          </FormLabel>
          <Button
            m={16}
            mb={0}
            disabled={!(label && file)}
            onClick={addFile}
            colorScheme="yellow"
          >
            Submit
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
};
