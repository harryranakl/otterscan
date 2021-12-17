import React, { useContext, useMemo } from "react";
import ContentFrame from "../ContentFrame";
import TransactionAddress from "../components/TransactionAddress";
import TraceItem from "./TraceItem";
import { TransactionData } from "../types";
import { useBatch4Bytes } from "../use4Bytes";
import { useTraceTransaction, useUniqueSignatures } from "../useErigonHooks";
import { RuntimeContext } from "../useRuntime";
import { tracesCollector } from "../useResolvedAddresses";

type TraceProps = {
  txData: TransactionData;
};

const Trace: React.FC<TraceProps> = ({ txData }) => {
  const { provider } = useContext(RuntimeContext);
  const traces = useTraceTransaction(provider, txData.transactionHash);
  const uniqueSignatures = useUniqueSignatures(traces);
  const sigMap = useBatch4Bytes(uniqueSignatures);

  const addrCollector = useMemo(() => tracesCollector(traces), [traces]);

  return (
    <ContentFrame tabs>
      <div className="mt-4 mb-5 space-y-3 font-code text-sm flex flex-col items-start overflow-x-auto">
        {traces ? (
          <>
            <div className="border hover:border-gray-500 rounded px-1 py-0.5">
              <TransactionAddress address={txData.from} />
            </div>
            <div className="ml-5 space-y-3 self-stretch">
              {traces.map((t, i, a) => (
                <TraceItem
                  key={i}
                  t={t}
                  last={i === a.length - 1}
                  fourBytesMap={sigMap}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="border hover:border-gray-500 rounded px-1 py-1 w-96 h-7">
            <div className="animate-pulse w-full h-full rounded bg-gray-200"></div>
          </div>
        )}
      </div>
    </ContentFrame>
  );
};

export default React.memo(Trace);
