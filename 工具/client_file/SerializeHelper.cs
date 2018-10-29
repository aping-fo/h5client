using Com.Game.ConfigData;
using Protocol;
using CodeStage.AntiCheat.ObscuredTypes;
using ByteBuilder;

namespace Com.Game.ConfigData
{
	//(工具自动生成，请勿手动修改！）
	[System.Serializable]
	public class SerializeHelper
	{

		
		public static LevelCfg[] GetLevelCfg1(BufferBuilder bb)
		{
			if(bb.GetNullFlag())
			{
				return null;
			}
			else
			{
				int length = bb.Get7BitEncodeInt();
				LevelCfg[] value = new LevelCfg[length];
				for(int i=0;i<length;i++)
				{
					value[i] = SerializeHelper.GetLevelCfg(bb);
				}
				return value;
			}
		}

		
		public static void PutLevelCfg1(BufferBuilder bb,LevelCfg[] value)
		{
			if(!bb.PutNullFlag(value))
			{
				int length = value.Length;
				bb.Put7BitEncodeInt(length);
				for(int i=0;i<length;i++)
				{
					SerializeHelper.PutLevelCfg(bb,value[i]);
				}
			}
		}

		
        public static LevelCfg GetLevelCfg(BufferBuilder bb)
        {
            if(bb.GetNullFlag())
                return null;
            else 
            {
                LevelCfg value = new LevelCfg();
                value.Decode(bb);
                return value;
            }
        }

		
        public static void PutLevelCfg(BufferBuilder bb,LevelCfg value) 
        {
            if(!bb.PutNullFlag(value))
                value.Encode(bb);
        }

		
		public static QuestionCfg[] GetQuestionCfg1(BufferBuilder bb)
		{
			if(bb.GetNullFlag())
			{
				return null;
			}
			else
			{
				int length = bb.Get7BitEncodeInt();
				QuestionCfg[] value = new QuestionCfg[length];
				for(int i=0;i<length;i++)
				{
					value[i] = SerializeHelper.GetQuestionCfg(bb);
				}
				return value;
			}
		}

		
		public static void PutQuestionCfg1(BufferBuilder bb,QuestionCfg[] value)
		{
			if(!bb.PutNullFlag(value))
			{
				int length = value.Length;
				bb.Put7BitEncodeInt(length);
				for(int i=0;i<length;i++)
				{
					SerializeHelper.PutQuestionCfg(bb,value[i]);
				}
			}
		}

		
        public static QuestionCfg GetQuestionCfg(BufferBuilder bb)
        {
            if(bb.GetNullFlag())
                return null;
            else 
            {
                QuestionCfg value = new QuestionCfg();
                value.Decode(bb);
                return value;
            }
        }

		
        public static void PutQuestionCfg(BufferBuilder bb,QuestionCfg value) 
        {
            if(!bb.PutNullFlag(value))
                value.Encode(bb);
        }

		
		public static string[] GetString1(BufferBuilder bb)
		{
			if(bb.GetNullFlag())
			{
				return null;
			}
			else
			{
				int length = bb.Get7BitEncodeInt();
				string[] value = new string[length];
				for(int i=0;i<length;i++)
				{
					value[i] = bb.GetString();
				}
				return value;
			}
		}

		
		public static void PutString1(BufferBuilder bb,string[] value)
		{
			if(!bb.PutNullFlag(value))
			{
				int length = value.Length;
				bb.Put7BitEncodeInt(length);
				for(int i=0;i<length;i++)
				{
					bb.PutString(value[i]);
				}
			}
		}

		
		public static GlobalConfig[] GetGlobalConfig1(BufferBuilder bb)
		{
			if(bb.GetNullFlag())
			{
				return null;
			}
			else
			{
				int length = bb.Get7BitEncodeInt();
				GlobalConfig[] value = new GlobalConfig[length];
				for(int i=0;i<length;i++)
				{
					value[i] = SerializeHelper.GetGlobalConfig(bb);
				}
				return value;
			}
		}

		
		public static void PutGlobalConfig1(BufferBuilder bb,GlobalConfig[] value)
		{
			if(!bb.PutNullFlag(value))
			{
				int length = value.Length;
				bb.Put7BitEncodeInt(length);
				for(int i=0;i<length;i++)
				{
					SerializeHelper.PutGlobalConfig(bb,value[i]);
				}
			}
		}

		
        public static GlobalConfig GetGlobalConfig(BufferBuilder bb)
        {
            if(bb.GetNullFlag())
                return null;
            else 
            {
                GlobalConfig value = new GlobalConfig();
                value.Decode(bb);
                return value;
            }
        }

		
        public static void PutGlobalConfig(BufferBuilder bb,GlobalConfig value) 
        {
            if(!bb.PutNullFlag(value))
                value.Encode(bb);
        }

		
		public static SelfTestCfg[] GetSelfTestCfg1(BufferBuilder bb)
		{
			if(bb.GetNullFlag())
			{
				return null;
			}
			else
			{
				int length = bb.Get7BitEncodeInt();
				SelfTestCfg[] value = new SelfTestCfg[length];
				for(int i=0;i<length;i++)
				{
					value[i] = SerializeHelper.GetSelfTestCfg(bb);
				}
				return value;
			}
		}

		
		public static void PutSelfTestCfg1(BufferBuilder bb,SelfTestCfg[] value)
		{
			if(!bb.PutNullFlag(value))
			{
				int length = value.Length;
				bb.Put7BitEncodeInt(length);
				for(int i=0;i<length;i++)
				{
					SerializeHelper.PutSelfTestCfg(bb,value[i]);
				}
			}
		}

		
        public static SelfTestCfg GetSelfTestCfg(BufferBuilder bb)
        {
            if(bb.GetNullFlag())
                return null;
            else 
            {
                SelfTestCfg value = new SelfTestCfg();
                value.Decode(bb);
                return value;
            }
        }

		
        public static void PutSelfTestCfg(BufferBuilder bb,SelfTestCfg value) 
        {
            if(!bb.PutNullFlag(value))
                value.Encode(bb);
        }

		
		public static int[] Get7BitEncodeInt1(BufferBuilder bb)
		{
			if(bb.GetNullFlag())
			{
				return null;
			}
			else
			{
				int length = bb.Get7BitEncodeInt();
				int[] value = new int[length];
				for(int i=0;i<length;i++)
				{
					value[i] = bb.Get7BitEncodeInt();
				}
				return value;
			}
		}

		
		public static void Put7BitEncodeInt1(BufferBuilder bb,int[] value)
		{
			if(!bb.PutNullFlag(value))
			{
				int length = value.Length;
				bb.Put7BitEncodeInt(length);
				for(int i=0;i<length;i++)
				{
					bb.Put7BitEncodeInt(value[i]);
				}
			}
		}

		
		public static SelfTestResultCfg[] GetSelfTestResultCfg1(BufferBuilder bb)
		{
			if(bb.GetNullFlag())
			{
				return null;
			}
			else
			{
				int length = bb.Get7BitEncodeInt();
				SelfTestResultCfg[] value = new SelfTestResultCfg[length];
				for(int i=0;i<length;i++)
				{
					value[i] = SerializeHelper.GetSelfTestResultCfg(bb);
				}
				return value;
			}
		}

		
		public static void PutSelfTestResultCfg1(BufferBuilder bb,SelfTestResultCfg[] value)
		{
			if(!bb.PutNullFlag(value))
			{
				int length = value.Length;
				bb.Put7BitEncodeInt(length);
				for(int i=0;i<length;i++)
				{
					SerializeHelper.PutSelfTestResultCfg(bb,value[i]);
				}
			}
		}

		
        public static SelfTestResultCfg GetSelfTestResultCfg(BufferBuilder bb)
        {
            if(bb.GetNullFlag())
                return null;
            else 
            {
                SelfTestResultCfg value = new SelfTestResultCfg();
                value.Decode(bb);
                return value;
            }
        }

		
        public static void PutSelfTestResultCfg(BufferBuilder bb,SelfTestResultCfg value) 
        {
            if(!bb.PutNullFlag(value))
                value.Encode(bb);
        }


	}
}
