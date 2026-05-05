import { useMemo } from "react";
import { useI18n } from "../../i18n/I18nContext";
import Table from "../table/Table";
import moment from "moment";

interface Props {
  readonly data: any[];
  readonly loading: boolean;
}

export default function DashboardObjectTable({ data = [], loading }: Props) {
  const { translate } = useI18n();

  const columns = useMemo(
    () => [
      {
        Header: translate("Loyiha nomi"),
        accessor: "project",
        width: 220,
      },
      {
        Header: translate("Hududi"),
        accessor: "regionAndDistrict",
        width: 280,
        Cell: (row: any) => (
          <span>
            {row?.row?.original?.region +
              ", " +
              row?.row?.original?.district +
              ", " +
              row?.row?.original?.street}
          </span>
        ),
      },
      {
        Header: translate("Obyekt nomi va manzili"),
        accessor: "nameAndAddress",
        width: 280,
      },
      {
        Header: translate("Ulanish turi"),
        accessor: "connectionType",
        width: 140,
      },
      {
        Header: translate("Joylashuv"),
        accessor: "longitude",
        width: 180,
        Cell: (row: any) => (
          <span>{row?.row?.original?.latitude + ", " + row?.row?.original?.longitude}</span>
        ),
      },
      {
        Header: translate("Yaratilgan vaqti"),
        accessor: "createdDate",
        width: 180,
        Cell: (row: any) => (
          <div>{moment(row?.row?.original?.createdDate).format("DD.MM.YYYY | HH:mm")}</div>
        ),
      },
      {
        Header: translate("Yangilangan vaqti"),
        accessor: "updatedDate",
        width: 180,
        Cell: (row: any) => (
          <div>{moment(row?.row?.original?.updatedDate).format("DD.MM.YYYY | HH:mm")}</div>
        ),
      },
      {
        Header: translate("Tomonidan yaratilgan"),
        accessor: "creator",
        width: 180,
      },
    ],
    [translate],
  );

  return <Table loading={loading} columns={columns} data={data} />;
}
