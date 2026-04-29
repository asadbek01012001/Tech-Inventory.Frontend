import { useI18n } from "../../i18n/I18nContext";
import { useObyektApiContext } from "../../api/obyekt/ObyektApiContext";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { showError } from "../../utils/NotificationUtils";
import { ObjectFilter, ObjectFilterTabs } from "../../filters/ObjectFilter";
import { GroupBox } from "../ui/GroupBox";
import { toast } from "react-toastify";
import { useShallowEqualSelector } from "../../hooks/useShallowSelector";
import { appIsCreatedBySelector, switchIsCreatedBy } from "../../reducers/appReducer";
import { profileSelector, userIdSelector } from "../../reducers/authReducer";
import { CheckRole } from "../../utils/CheckRole";
import { UserRoles } from "../../api/AppDto";
import axios from "axios";

import AddIcon from "../icons/AddIcon";
import Button, { BgColors } from "../ui/Button";
import ObjectTable from "./ObjectTable";
import DeleteIcon from "../icons/DeleteIcon";
import Paginator from "../paginator/Paginator";
import Modal from "../ui/Modal";
import YesOrNoModal from "../ui/YesOrNoModal";
import useLocationHelpers from "../../hooks/userLocationHelpers";
import TabPage from "../tabs/TabPage";
import ObjectFilterWrapper from "./ObjectFilterWrapper";
import LeafletMapForMarkers from "../map/LeafletMapForMarkers";
import ObjectView from "./ObjectView";
import ObjectFormWrapper from "./ObjectFormWrapper";
import ProductViews from "../products/ProductViews";

interface Props {
  readonly filter: ObjectFilter;
}

// Helper function to create filter object from URL params
const createFilterFromUrl = (filter: ObjectFilter) => {
  const uiFilter = filter.getUiFilter();
  return {
    region: {
      label: "Hammasi",
      value: Number(uiFilter.region) || 0,
    },
    district: {
      label: "Hammasi",
      value: Number(uiFilter.district) || 0,
    },
    street: {
      label: "Hammasi",
      value: Number(uiFilter.street) || 0,
    },
    project: {
      label: "Hammasi",
      value: Number(uiFilter.project) || 0,
    },
    order: {
      label: "Hammasi",
      value: Number(uiFilter.order) || 0,
    },
    classType: {
      label: "Hammasi",
      value: Number(uiFilter.classType) || 0,
    },
    class: {
      label: "Hammasi",
      value: Number(uiFilter.class) || 0,
    },
    searchValue: "",
  };
};

const initValue = {
  region: {
    label: "Hammasi",
    value: 0,
  },
  district: {
    label: "Hammasi",
    value: 0,
  },
  street: {
    label: "Hammasi",
    value: 0,
  },
  project: {
    label: "Hammasi",
    value: 0,
  },
  order: {
    label: "Hammasi",
    value: 0,
  },
  classType: {
    label: "Hammasi",
    value: 0,
  },
  class: {
    label: "Hammasi",
    value: 0,
  },
  searchValue: "",
};

export default function ObjectTableWrapper({ filter }: Props) {
  // Initialize from URL params or use default
  const [initialFilter, setInitialFilter] = useState<any>(() => createFilterFromUrl(filter));

  const [data, setData] = useState<any>();
  const [deleteDocuments, setDeleteDocuments] = useState<number[]>();
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [mapViewModal, setMapViewModal] = useState(false);
  const [mapViewData, setMapViewData] = useState<any>(null);

  // Modal states for View, Edit, Add
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [addModal, setAddModal] = useState(false);

  const locationHelpers = useLocationHelpers();
  const showOnlyCreatedMe = useShallowEqualSelector(appIsCreatedBySelector);
  const userId = useShallowEqualSelector(userIdSelector);

  const profile = useShallowEqualSelector(profileSelector);

  const { translate } = useI18n();

  const { ObyektApi } = useObyektApiContext();

  const isFirstFilterRender = useRef(true);

  // Sync URL whenever filter state changes (skip initial render to avoid pushing current URL again)
  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }
    locationHelpers.replaceQuery({
      region: initialFilter.region?.value || 0,
      district: initialFilter.district?.value || 0,
      street: initialFilter.street?.value || 0,
      project: initialFilter.project?.value || 0,
      order: initialFilter.order?.value || 0,
      classType: initialFilter.classType?.value || 0,
      class: initialFilter.class?.value || 0,
    });
  }, [initialFilter]);

  const handleReadOnMap = useCallback(
    (id: number) => {
      setMapViewData(null);
      setMapViewModal(true);
      ObyektApi.getOneObyekt({ id })
        .then((r) => setMapViewData(r?.data))
        .catch(showError);
    },
    [ObyektApi],
  );

  const handleMapViewClose = useCallback(() => {
    setMapViewModal(false);
    setMapViewData(null);
  }, []);

  // View modal handler
  const handleViewObyekt = useCallback(
    (id: number) => {
      setViewData(null);
      setViewModal(true);
      ObyektApi.getOneObyekt({ id })
        .then((r) => setViewData(r?.data))
        .catch(showError);
    },
    [ObyektApi],
  );

  const handleViewModalClose = useCallback(() => {
    setViewModal(false);
    setViewData(null);
  }, []);

  // Edit modal handler
  const handleEditObyekt = useCallback(
    (id: number) => {
      setEditData(null);
      setEditModal(true);
      ObyektApi.getOneObyekt({ id })
        .then((r) => setEditData(r?.data))
        .catch(showError);
    },
    [ObyektApi],
  );

  const handleEditModalClose = useCallback(() => {
    setEditModal(false);
    setEditData(null);
  }, []);

  // Add modal handler
  const handleAddModalClose = useCallback(() => {
    setAddModal(false);
  }, []);

  const downloadPdf = useCallback((value: any) => {
    ObyektApi.getObyektReport(value, `Obyekt-${value}.pdf`);
  }, []);

  const downloadFile = useCallback((value: any) => {
    axios({
      url: `http://172.24.201.4:1000/api/Object/tech-inventory-bucket?token=${value?.fileName}`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link: any = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${value?.fileName}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
  }, []);

  const mapMarkerList = useMemo(() => {
    if (!mapViewData?.latitude || !mapViewData?.longitude) return [];
    return [
      {
        id: mapViewData.id,
        latitude: mapViewData.latitude,
        longitude: mapViewData.longitude,
        status: mapViewData.status || "Active",
        nameAndAddress: mapViewData.nameAndAddress,
      },
    ];
  }, [mapViewData]);

  const mapCenter = useMemo<[number, number]>(() => {
    const lat = parseFloat(mapViewData?.latitude);
    const lng = parseFloat(mapViewData?.longitude);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
    return [41.834704258607715, 64.20046593138136];
  }, [mapViewData]);

  // Handler to clear filter
  const handleClearFilter = useCallback(() => {
    setInitialFilter(initValue);
    // URL is synced automatically via useEffect above
  }, []);

  useEffect(() => {
    setLoading(true);
    ObyektApi.getObyekts({
      ...filter.getObjectFilter(),
      // createdBy: Number(userId),
      regionId: initialFilter?.region?.value,
      districtId: initialFilter?.district?.value,
      streetId: initialFilter?.street?.value,
      projectId: initialFilter?.project?.value,
      numberOfOrderId: initialFilter?.order?.value,
      objectClassificationTypeId: initialFilter?.classType?.value,
      objectClassificationId: initialFilter?.class?.value,
      searchValue: initialFilter?.searchValue,
    })
      .then((r) => {
        setData(r?.data);
        setLoading(false);
      })
      .catch(showError);
  }, [ObyektApi, filter, userId, showOnlyCreatedMe, initialFilter]);

  return (
    <>
      <TabPage
        headerComponent={
          <div className="d-flex justify-content-between w-100">
            {!Boolean(CheckRole(UserRoles.Accountant, profile)) ? (
              <Button
                className="py-1 px-3 text-light"
                bgColor={BgColors.Green}
                heigh="34px"
                icon={<AddIcon />}
                onClick={() => setAddModal(true)}
              >
                {translate("ADD_BUTTON_TITLE")}
              </Button>
            ) : (
              <div />
            )}

            <ObjectFilterWrapper
              initialFilter={initialFilter}
              setInitialFilter={setInitialFilter}
            />
            <Button
              className="py-1 px-3 text-light"
              bgColor={BgColors.Yellow}
              heigh="34px"
              onClick={handleClearFilter}
            >
              {translate("Tozalash")}
            </Button>
          </div>
        }
        footerComponent={
          <>
            <div className="d-flex justify-content-between align-items-center w-100 mt-4 pb-3">
              {!Boolean(CheckRole(UserRoles.Accountant, profile)) ? (
                <Button
                  disabled={!(deleteDocuments && deleteDocuments?.length > 0)}
                  onClick={() => setDeleteModal(true)}
                  className="py-2 px-2 text-light"
                  bgColor={
                    deleteDocuments && deleteDocuments?.length > 0 ? BgColors.Red : BgColors.White
                  }
                >
                  <DeleteIcon
                    color={deleteDocuments && deleteDocuments?.length > 0 ? "#fff" : "#000"}
                  />
                </Button>
              ) : (
                <div />
              )}
              <Paginator
                filter={filter}
                totalPageCount={data?.totalPageCount}
                totalRowCount={data?.totalRowCount}
              />
            </div>
            <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
              <GroupBox>
                <YesOrNoModal
                  title="REGION_TABLE_DELETE_REGIONS_MODAL_QUESTION"
                  setResponse={(value: string) => {
                    if (value === "YES") {
                      const json: any = {
                        obyektIds: deleteDocuments,
                      };
                      ObyektApi.deleteObyekts(json)
                        .then((r) => {
                          toast.success(r?.data?.message);
                          window.location.reload();
                        })
                        .catch(showError);
                    }
                    setDeleteModal(false);
                  }}
                />
              </GroupBox>
            </Modal>
          </>
        }
      >
        <ObjectTable
          loading={loading}
          data={data?.data}
          selectIds={setDeleteDocuments}
          readOnMap={handleReadOnMap}
          downloadPdf={downloadPdf}
          // downloadPdf={(value) => ObyektApi.downloadPdf({ id: value })}
          editObyekt={handleEditObyekt}
          setOjectForView={handleViewObyekt}
        />
      </TabPage>

      <Modal show={mapViewModal} onHide={handleMapViewClose} width="90vw" height="80vh">
        <div style={{ height: "40vh" }}>
          <LeafletMapForMarkers
            markerList={mapMarkerList}
            center={mapCenter}
            zoom={15}
            selectPolygonId={0}
          />
        </div>
        {mapViewData && (
          <>
            <ObjectView initialValues={mapViewData} setPath={downloadFile} />
            <ProductViews initialValues={mapViewData} setInitialValues={setMapViewData} readonly />
          </>
        )}
      </Modal>

      {/* View Modal */}
      <Modal show={viewModal} onHide={handleViewModalClose} width="90vw" height="80vh">
        {viewData && (
          <>
            <ObjectView initialValues={viewData} setPath={downloadFile} />
            <ProductViews initialValues={viewData} setInitialValues={setViewData} readonly />
          </>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal show={editModal} onHide={handleEditModalClose} width="90vw" height="90vh">
        {editData && (
          <ObjectFormWrapper
            filter={filter}
            initialValues={editData}
            isModal={true}
            onModalClose={handleEditModalClose}
          />
        )}
      </Modal>

      {/* Add Modal */}
      <Modal show={addModal} onHide={handleAddModalClose} width="90vw" height="90vh">
        <ObjectFormWrapper filter={filter} isModal={true} onModalClose={handleAddModalClose} />
      </Modal>
    </>
  );
}
