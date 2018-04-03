﻿namespace Microsoft.HpcAcm.Services.Common
{
    using System;
    using System.Collections.Generic;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;

    public class TaskItem
    {
        public virtual T GetMessage<T>() => default(T);
        public virtual Task FinishAsync(CancellationToken token) => Task.CompletedTask;
    }
}
