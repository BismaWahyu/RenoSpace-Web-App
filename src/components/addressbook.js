import { React, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useGeolocated } from "react-geolocated";
import GoogleMapReact from "google-map-react";
import {
  Tag,
  Button,
  Modal,
  Popconfirm,
  Skeleton,
  Typography,
  Tooltip,
  Divider,
  Input,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteFilled,
  QuestionCircleOutlined,
  AimOutlined,
} from "@ant-design/icons";
const { Title } = Typography;

const AnyReactComponent = () => (
  <Image src="/assets/map-marker.png" alt="marker" width="40" height="40" />
);

export default function Addressbook({
  type,
  residences,
  content,
  setDefault,
  onEdit,
  onRemove,
}) {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const defaultProps = {
    center: {
      lat: coords?.latitude ? coords?.latitude : 22.322628,
      lng: coords?.longitude ? coords?.longitude : 114.175174,
    },
    zoom: 18,
  };

  return (
    <>
      {residences.length > 0 && (
        <div className="flex-wrap md:flex">
          {residences
            .slice()
            .sort((a, b) => {
              if (a.is_current_residence && !b.is_current_residence) {
                return -1;
              } else if (!a.is_current_residence && b.is_current_residence) {
                return 1;
              }
              return 0;
            })
            .map((addr, idx) => (
              <div
                key={idx}
                className={type === "page" ? "mb-4 md:w-1/2" : "mb-4 md:w-full"}
              >
                <div className="ml-2 mr-2 h-full flex-1 rounded-xl shadow-lg">
                  <div
                    className="overflow-hidden rounded-xl"
                    style={{ height: "300px", width: "100%" }}
                  >
                    <GoogleMapReact
                      bootstrapURLKeys={{
                        key: "AIzaSyCqNVISSKUXTzSUejfJfljdtAH5UEODA54",
                      }}
                      defaultCenter={{
                        lat: Number(addr.latitude),
                        lng: Number(addr.longitude),
                      }}
                      defaultZoom={defaultProps.zoom}
                    >
                      <AnyReactComponent
                        lat={Number(addr.latitude)}
                        lng={Number(addr.longitude)}
                        text="📍"
                      />
                    </GoogleMapReact>
                  </div>
                  <div className="flex flex-col p-4">
                    <div
                      className={addr.is_current_residence ? "mb-4" : "hidden"}
                    >
                      <Tag bordered={false} color="success">
                        <span className="text-[16px]">
                          {content.main_residence}
                        </span>
                      </Tag>
                    </div>
                    <div
                      className={
                        addr.is_current_residence
                          ? "mb-4 flex items-center justify-between gap-4"
                          : "mb-4 mt-4 flex items-center justify-between gap-4"
                      }
                    >
                      <div>
                        <Title level={3}>{addr.name}</Title>
                        <p>
                          {addr?.street +
                            (addr?.room_no ? ", " + addr?.room_no : "")}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-row justify-between">
                          {!addr.is_current_residence && (
                            <Tooltip title="Set as Main" color={"green"}>
                              <Button
                                icon={<AimOutlined />}
                                className="btn-gradient-custom-1 mb-3 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                loading={loadingSubmit}
                                onClick={() => setDefault(addr.id)}
                              />
                            </Tooltip>
                          )}
                          <Tooltip
                            className={type === "modal" ? "hidden" : ""}
                            title="Edit"
                            color={"blue"}
                          >
                            <Button
                              icon={<EditOutlined />}
                              size={12}
                              onClick={() => onEdit(addr.id)}
                              className="btn-gradient-custom-1 mx-2 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            />
                          </Tooltip>
                          <Popconfirm
                            title="Delete Residence"
                            description="Are you sure to delete this residence?"
                            icon={
                              <QuestionCircleOutlined
                                style={{ color: "red" }}
                              />
                            }
                            okButtonProps={{
                              className:
                                "btn-gradient-custom-1 rounded-lg bg-blue-700 text-sm text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300",
                              loading: isDelete,
                            }}
                            onConfirm={() => onRemove(addr.id)}
                          >
                            <Tooltip
                              className={type === "modal" ? "hidden" : ""}
                              title="Delete"
                              color={"red"}
                            >
                              <Button
                                icon={<DeleteFilled />}
                                size={12}
                                className="btn-gradient-custom-1 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                              />
                            </Tooltip>
                          </Popconfirm>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {(idx + 1) % 2 === 0 && <div className="h-0 w-full"></div>}
              </div>
            ))}
        </div>
      )}
    </>
  );
}
